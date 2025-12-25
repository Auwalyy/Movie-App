import { View, Image, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { authStyles } from '../../styles/authStyles'
import { commonStyles } from '../../styles/commonStyles'
import CustomText from '../../components/shared/CustomText'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useWS } from '../../services/WSProvider'
import PhoneInput from '../../components/shared/PhoneInput'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '@/src/components/shared/CustomButton'
import { signIn } from '@/src/services/authService'

const Auth = () => {
  const { updateAccessToken } = useWS();
  const [phone, setPhone] = useState('');


  const handleNext = async() => {
  // Log the phone number to see what's being sent
  console.log("Phone number entered:", phone);
  console.log("Phone length:", phone.length);
  
  if(!phone || phone.length < 10) {
    Alert.alert("Please enter a valid phone number");
    return;
  }
  
  try {
    await signIn({ role: "customer", phone }, updateAccessToken);
  } catch (error: any) {
    console.error("Sign in failed:", error);
    
    // Show more detailed error
    const errorMessage = error.response?.data?.message 
      || error.response?.data?.error
      || error.message 
      || "Unable to sign in. Please try again.";
      
    Alert.alert("Sign In Failed", errorMessage);
  }
}

  return (
    <SafeAreaView style={authStyles.container}>
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

        <PhoneInput
          value={phone}
          onChangeText={setPhone}
        />
        
        {/* Added some bottom padding for better spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={authStyles.footerContainer}>
        <CustomText 
          fontFamily='Regular'
          variant='h7'
          style={[
            commonStyles.lightText,
            { 
              textAlign: 'center',
              marginHorizontal: 20
            }
          ]}
        >
          By continuing, you agree to our Terms of Service and Privacy Policy of Riderr.
        </CustomText>

        <CustomButton 
          title="Next"
          onPress={handleNext}
          loading={false}
          disabled={false}
        />
      </View>
    </SafeAreaView>
  )
}

export default Auth