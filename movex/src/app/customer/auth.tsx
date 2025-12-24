import { View, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { authStyles } from '../../styles/authStyles'
import { commonStyles } from '../../styles/commonStyles'
import CustomText from '../../components/shared/CustomText'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useWS } from '../../services/WSProvider'
import PhoneInput from '../../components/shared/PhoneInput'

const Auth = () => {
  const { updateAccessToken } = useWS();
  const [phone, setPhone] = useState('');

  return (
    <ScrollView contentContainerStyle={authStyles.container}>
      <View style={commonStyles.flexRowBetween}>
        <Image 
          source={require("@/src/assets/images/logo_t.png")} 
          style={authStyles.logo}
        />
        <TouchableOpacity style={authStyles.flexRowGap}>
          <MaterialIcons name="help" size={18} color="grey" />
          <CustomText fontFamily='Regular' variant='h7'>
            Help
          </CustomText> 
        </TouchableOpacity>
      </View>

      <CustomText fontFamily='Regular' variant='h5'>
        What is your number?
      </CustomText>

      <CustomText
        variant='h7'
        fontFamily='Regular'
        style={commonStyles.lightText}
      >
        Enter your phone number to proceed
      </CustomText>
    </ScrollView>
  )
}

export default Auth