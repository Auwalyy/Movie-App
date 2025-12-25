import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from './config';
import { tokenStorage } from '../store/storage';
import { refresh_token } from './apiInterceptors';

interface WSContextType {
  socket: Socket | null;
  isConnected: boolean;
  updateAccessToken: () => void;
}

const WSContext = createContext<WSContextType | undefined>(undefined);

export const WSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socket = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 3;

  const connectSocket = () => {
    const accessToken = tokenStorage.getString('access_token');
    
    // Don't try to connect if there's no token
    if (!accessToken) {
      console.log('No access token available, skipping WebSocket connection');
      return;
    }

    // Disconnect existing socket if any
    if (socket.current?.connected) {
      socket.current.disconnect();
    }

    socket.current = io(SOCKET_URL, {
      auth: { token: accessToken },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
    });

    socket.current.on('connect', () => {
      console.log('✅ WebSocket connected');
      setIsConnected(true);
      reconnectAttempts.current = 0;
    });

    socket.current.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
      setIsConnected(false);
    });

    socket.current.on('connect_error', async (error: any) => {
      console.log('Socket connection error:', error.message);
      
      // Only try to refresh token if we have one and error is auth-related
      if (error.message?.includes('Authentication') || error.message?.includes('token')) {
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          console.log(`Attempting to refresh token (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})`);
          
          try {
            await refresh_token();
            const newToken = tokenStorage.getString('access_token');
            
            if (newToken && socket.current) {
              socket.current.auth = { token: newToken };
              socket.current.connect();
            }
          } catch (refreshError) {
            console.log('Token refresh failed, will retry on next attempt');
          }
        } else {
          console.log('Max reconnection attempts reached, giving up');
        }
      }
    });
  };

  const updateAccessToken = () => {
    console.log('🔄 Access token updated, reconnecting WebSocket...');
    connectSocket();
  };

  useEffect(() => {
    // Only connect if we have a token
    const accessToken = tokenStorage.getString('access_token');
    if (accessToken) {
      connectSocket();
    } else {
      console.log('No token found, WebSocket will connect after sign in');
    }

    return () => {
      if (socket.current) {
        console.log('Cleaning up WebSocket connection');
        socket.current.disconnect();
      }
    };
  }, []);

  return (
    <WSContext.Provider value={{ socket: socket.current, isConnected, updateAccessToken }}>
      {children}
    </WSContext.Provider>
  );
};

export const useWS = () => {
  const context = useContext(WSContext);
  if (!context) {
    throw new Error('useWS must be used within WSProvider');
  }
  return context;
};