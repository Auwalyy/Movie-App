import axios from 'axios'
import { BASE_URL } from './config'
import { tokenStorage } from '../store/storage'
import { logout } from './authService'

export const refresh_token = async (): Promise<string | null> => {
  try {
    const refreshToken = tokenStorage.getString("refresh_token")
    
    if (!refreshToken) {
      throw new Error("No refresh token available")
    }
    
    const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
      refreshToken: refreshToken,
    })
    
    const new_access_token = response.data.access_token // Fixed typo: acccess → access
    const new_refresh_token = response.data.refresh_token
    
    tokenStorage.set("access_token", new_access_token)
    tokenStorage.set("refresh_token", new_refresh_token)
    
    return new_access_token
  } catch (error) {
    console.log("REFRESH TOKEN ERROR:", error)
    tokenStorage.clearAll()
    logout()
    return null
  }
}

export const appAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor
appAxios.interceptors.request.use(
  (config) => {
    const accessToken = tokenStorage.getString('access_token')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - FIXED SYNTAX
appAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    // Check for 401 error and avoid infinite retry loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const newAccessToken = await refresh_token()
        
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return appAxios(originalRequest) // Use appAxios, not axios
        }
      } catch (refreshError) {
        console.log("Error refreshing token:", refreshError)
        logout()
      }
    }
    
    return Promise.reject(error)
  }
)

export default appAxios 