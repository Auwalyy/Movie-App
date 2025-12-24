import { View, Text, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useFonts } from 'expo-font'
import { commonStyles } from '../styles/commonStyles'
import CustomText from '../components/shared/CustomText'
import { splashStyles } from '../styles/splashStyles'
import { useUserStore } from '../store/userStore'
import { tokenStorage } from '../store/storage'
import { resetAndNavigate } from '../utils/Helpers'
import { jwtDecode } from 'jwt-decode'  
import { logout } from '../services/authService'
import { refresh_token } from '../services/apiInterceptors'
import { router, useRootNavigationState } from 'expo-router'  

interface DecodedToken {
  exp: number;
}

const Page = () => {
  const [loaded] = useFonts({
    Bold: require("../assets/fonts/NotoSans-Bold.ttf"),
    Regular: require("../assets/fonts/NotoSans-Regular.ttf"),
    Light: require("../assets/fonts/NotoSans-Light.ttf"),
    Medium: require("../assets/fonts/NotoSans-Medium.ttf"),
    Semibold: require("../assets/fonts/NotoSans-SemiBold.ttf"),
  })

  const { user } = useUserStore();
  const [hasNavigated, setHasNavigated] = useState(false);
  const navigationState = useRootNavigationState(); // Check if router is ready

  const tokenCheck = async () => {
    // Don't navigate if router isn't ready
    if (!navigationState?.key) return;
    
    const access_token = tokenStorage.getString("access_token") as string;
    const refresh_tokens = tokenStorage.getString("refresh_token") as string;

    if(access_token){
      const decodedAccessToken = jwtDecode<DecodedToken>(access_token);
      const decodedRefreshToken = jwtDecode<DecodedToken>(refresh_tokens);
      const currentTime = Date.now() / 1000;

      if(decodedRefreshToken?.exp < currentTime) {
        resetAndNavigate('/role');
        logout();
        Alert.alert("Session Expired, please login again");
        return;
      }

      if(decodedAccessToken?.exp < currentTime){
        try {
          await refresh_token();
        } catch (error) {
          console.log(error);
          Alert.alert("Refresh Token Error");
          resetAndNavigate('/role');
          return;
        }
      }

      if(user) {
        resetAndNavigate("/customer/home");
      } else {
        resetAndNavigate("/rider/home");
      }
      return;
    }

    resetAndNavigate('/role');
  }

  useEffect(() => {
    if(loaded && !hasNavigated && navigationState?.key){
      const timeOutId = setTimeout(() => {
        tokenCheck();
        setHasNavigated(true);
      }, 1000); // Increased to 1 second to ensure routes are ready
      
      return () => clearTimeout(timeOutId);
    }
  }, [loaded, hasNavigated, navigationState?.key]);

  // Show loading while fonts load or router isn't ready
  if (!loaded || !navigationState?.key) {
    return (
      <View style={commonStyles.container}>
        <Image 
          source={require("../assets/images/riderlogo.jpg")}
          style={splashStyles.img}
        />
        <CustomText 
          variant='h5' 
          fontFamily='Regular' 
          style={splashStyles.text}
        >
          Loading...
        </CustomText>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <Image 
        source={require("../assets/images/riderlogo.jpg")}
        style={splashStyles.img}
      />
      <CustomText 
        variant='h5' 
        fontFamily='Regular' 
        style={splashStyles.text}
      >
        Riderr
      </CustomText>
    </View>
  )
}

export default Page