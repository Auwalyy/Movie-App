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


interface DecodedToken {
  exp: number;
}
const Page = () => {
 
    const [loaded ] = useFonts({
        Bold: require("../assets/fonts/NotoSans-Bold.ttf"),
        Regular: require("../assets/fonts/NotoSans-Regular.ttf"),
        Light: require("../assets/fonts/NotoSans-Light.ttf"),
        Medium: require("../assets/fonts/NotoSans-Medium.ttf"),
        Semibold: require("../assets/fonts/NotoSans-SemiBold.ttf"),
    })

    const { user } = useUserStore();

    const [hasNavigated, setHasNavigated] = useState(false);


    const tokenCheck = async() => {
      const access_token = tokenStorage.getString("access_token") as string;
      const refresh_tokens = tokenStorage.getString("refresh_token") as string;

      if(access_token){
        const decodedAccessToken = jwtDecode<DecodedToken>(access_token);
        const decodedRefreshToken = jwtDecode<DecodedToken>(refresh_tokens);

        const currentTime = Date.now() / 1000;

        if(decodedRefreshToken?.exp < currentTime) {
          resetAndNavigate("/role");
          logout();
          Alert.alert("session Expired, please login again");
        }

        if(decodedAccessToken?.exp < currentTime){
          try {
            refresh_token();
          } catch (error) {
            console.log(error);
            Alert.alert("Refresh Token Error");
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
      if(loaded && !hasNavigated){
        const timeOutId = setTimeout(() => {
          tokenCheck()
          setHasNavigated(true)
        },100)
      }
    },[])



  return (
    <View style={commonStyles.container}>
      <Image 
      source={require("../assets/images/riderlogo.jpg")}
      style={splashStyles.img}
      />
      <CustomText 
       variant='h5' fontFamily='Regular' style={splashStyles.text} > </CustomText>
    </View>
  )
}

export default Page