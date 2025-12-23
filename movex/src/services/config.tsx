

import { Platform } from "react-native";

export const BASE_URL = Platform.OS === "android" ?
    "https://10.151.213.235 :3000" :
    "https://10.0.2.2:3000"

export const SOCKET_URL = Platform.OS === "ios" ?
    "ws://locahost:3000" :
    "ws://10.0.2.2:3000"