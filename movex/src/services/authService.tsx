import { useRideStore } from "../store/rideStore";
import { useUserStore } from "../store/userStore"
import { resetAndNavigate } from "../utils/Helpers";
import { tokenStorage } from "../store/storage";
import axios from "axios";
import { BASE_URL } from "./config";

export const signIn = async(
    payload: {
        role: "customer" | "rider";
        phone: string;
    },
    updatedAccessToken: () => void
) => {
    const { setUser } = useUserStore.getState();
    const { setUser: setRiderUser } = useRideStore.getState();
    
    try {
        const res = await axios.post(`${BASE_URL}/auth/signin`, payload);
        
        if(res.data.user.role === "customer"){
            setUser(res.data.user);
        } else {
            setRiderUser(res.data.user);
        }
        
        // IMPORTANT: Wait for tokens to be saved before calling updateAccessToken
        await tokenStorage.set("access_token", res.data.access_token);
        await tokenStorage.set("refresh_token", res.data.refresh_token);
        
        // Small delay to ensure memory cache is updated
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Now call this AFTER tokens are saved
        updatedAccessToken();

        if(res.data.user.role === "customer"){
            resetAndNavigate("/customer/home");
        } else {
            resetAndNavigate("/rider/home")
        }
    } catch (error: any) {
        console.log("Sign in error:", error.message || error);
        throw error; // Re-throw so the UI can handle it
    }
}

export const logout = async (disconnect?: () => void) => {
    if(disconnect){
        disconnect()
    }

    const { clearData } = useUserStore.getState();
    const { clearRiderData } = useRideStore.getState();

    await tokenStorage.clearAll();
    clearRiderData();
    clearData();
    resetAndNavigate("/role")
}