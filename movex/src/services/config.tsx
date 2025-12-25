

import { Platform } from "react-native";

export const BASE_URL = Platform.OS === "android" ?
    "http://10.151.213.235:3000" :
    "http://10.151.213.235:3000"

export const SOCKET_URL = Platform.OS === "ios" ?
    "ws://10.151.213.235:3000" :
    "ws://10.151.213.235:3000"