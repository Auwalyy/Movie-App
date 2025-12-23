import { View, Text, Image } from 'react-native'
import React from 'react'
import { useFonts } from 'expo-font'
import { commonStyles } from '../styles/commonStyles'
import CustomText from '../components/shared/CustomText'
import { splashStyles } from '../styles/splashStyles'

const Page = () => {
 
    const [loading ] = useFonts({
        Bold: require("../assets/fonts/NotoSans-Bold.ttf"),
        Regular: require("../assets/fonts/NotoSans-Regular.ttf"),
        Light: require("../assets/fonts/NotoSans-Light.ttf"),
        Medium: require("../assets/fonts/NotoSans-Medium.ttf"),
        Semibold: require("../assets/fonts/NotoSans-SemiBold.ttf"),
    })

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