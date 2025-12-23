import { useRideStore } from "../store/rideStore";
import { useUserStore } from "../store/userStore"
import { resetAndNavigate } from "../utils/Helpers";
import { tokenStorage } from "../store/storage";


export const logout = async ( ) => {
    const { clearData } = useUserStore.getState();
    const { clearRiderData } = useRideStore.getState();

    tokenStorage.clearAll();
    clearRiderData();
    clearData();
    resetAndNavigate("/role")
}