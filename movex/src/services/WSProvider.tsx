import { createContext, useEffect, useRef, useState, useContext } from "react";
import { io, Socket } from "socket.io-client";
import { tokenStorage } from "../store/storage";
import { refresh_token } from "./apiInterceptors";
import { SOCKET_URL } from "./config";

interface WSService {
    initializeSocket: () => void;
    emit: (event: string, data?: any) => void;
    on: (event: string, cb: (data: any) => void) => void;
    off: (event: string) => void; // Fixed typo: offf -> off
    removeListener: (listenerName: string) => void;
    updateAccessToken: () => void;
    disconnect: () => void;
    isConnected: () => boolean;
}

const WSContext = createContext<WSService | undefined>(undefined);

export const useWebSocket = (): WSService => {
    const context = useContext(WSContext);
    if (!context) {
        throw new Error("useWebSocket must be used within WSProvider");
    }
    return context;
};

export const WSProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [socketAccessToken, setSocketAccessToken] = useState<string | null>(
        null
    );
    const socket = useRef<Socket | null>(null);
    const listeners = useRef<Map<string, ((data: any) => void)[]>>(new Map());

    // Initialize access token
    useEffect(() => {
        const token = tokenStorage.getString("access_token");
        setSocketAccessToken(token || null);
    }, []);

    // Initialize socket connection
    const initializeSocket = () => {
        if (!socketAccessToken) {
            console.warn("No access token available for WebSocket connection");
            return;
        }

        if (socket.current?.connected) {
            console.log("Socket already connected");
            return;
        }

        // Disconnect existing socket if any
        if (socket.current) {
            socket.current.disconnect();
        }

        socket.current = io(SOCKET_URL, {
            transports: ["websocket"],
            withCredentials: true,
            auth: {
                token: socketAccessToken,
            },
            extraHeaders: {
                Authorization: `Bearer ${socketAccessToken}`,
            },
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        // Connection event handlers
        socket.current.on("connect", () => {
            console.log("WebSocket connected successfully");
        });

        socket.current.on("connect_error", async (error) => {
            console.error("Socket connection error:", error.message);
            
            if (error.message.includes("Authentication") || 
                error.message.includes("auth") ||
                error.message === "Authentication error") {
                console.log("Authentication error detected, refreshing token...");
                
                try {
                    const newToken = await refresh_token();
                    if (newToken) {
                        updateAccessToken();
                    }
                } catch (refreshError) {
                    console.error("Token refresh failed:", refreshError);
                }
            }
        });

        socket.current.on("disconnect", (reason) => {
            console.log("Socket disconnected:", reason);
            if (reason === "io server disconnect") {
                // The server has forcefully disconnected the socket
                // You can attempt to reconnect after a delay
                setTimeout(() => {
                    if (socket.current && !socket.current.connected) {
                        socket.current.connect();
                    }
                }, 1000);
            }
        });

        // Re-register existing listeners
        listeners.current.forEach((callbacks, event) => {
            callbacks.forEach(callback => {
                socket.current?.on(event, callback);
            });
        });
    };

    // Effect to manage socket lifecycle
    useEffect(() => {
        if (socketAccessToken) {
            initializeSocket();
        }

        return () => {
            if (socket.current) {
                // Remove all listeners before disconnecting
                listeners.current.forEach((_, event) => {
                    socket.current?.removeAllListeners(event);
                });
                listeners.current.clear();
                socket.current.disconnect();
                socket.current = null;
            }
        };
    }, [socketAccessToken]);

    const emit = (event: string, data?: any) => {
        if (!socket.current?.connected) {
            console.warn("Cannot emit: Socket not connected");
            return;
        }
        socket.current.emit(event, data);
    };

    const on = (event: string, cb: (data: any) => void) => {
        if (!listeners.current.has(event)) {
            listeners.current.set(event, []);
        }
        listeners.current.get(event)?.push(cb);
        socket.current?.on(event, cb);
    };

    const off = (event: string, cb?: (data: any) => void) => {
        if (cb) {
            // Remove specific callback
            const callbacks = listeners.current.get(event);
            if (callbacks) {
                const index = callbacks.indexOf(cb);
                if (index > -1) {
                    callbacks.splice(index, 1);
                }
                socket.current?.off(event, cb);
            }
        } else {
            // Remove all callbacks for this event
            listeners.current.delete(event);
            socket.current?.removeAllListeners(event);
        }
    };

    const removeListener = (listenerName: string) => {
        off(listenerName);
    };

    const disconnect = () => {
        if (socket.current) {
            listeners.current.clear();
            socket.current.removeAllListeners();
            socket.current.disconnect();
            socket.current = null;
        }
    };

    const isConnected = () => {
        return socket.current?.connected || false;
    };

    const updateAccessToken = () => {
        const token = tokenStorage.getString("access_token");
        if (token !== socketAccessToken) {
            setSocketAccessToken(token || null);
        }
    };

    const socketService: WSService = {
        initializeSocket,
        emit,
        off,
        on,
        disconnect,
        removeListener,
        updateAccessToken,
        isConnected,
    };

    return (
        <WSContext.Provider value={socketService}>
            {children}
        </WSContext.Provider>
    );
};



export const useWS = (): WSService => {
    const socketService = useContext(WSContext);
    if(!socketService){
        throw new Error("useWS must be used with a WSProvider")
    }
    return socketService
}