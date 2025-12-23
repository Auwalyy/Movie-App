import { View, Text, SafeAreaView, Image, TouchableOpacity,ScrollView } from 'react-native'
import React from 'react'
import { authStyles } from '../../styles/authStyles'
 import { commonStyles } from '../../styles/commonStyles'
import CustomText from '../../components/shared/CustomText'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'


const Auth = () => {
  return (
    <SafeAreaView style={authStyles.container }>
      <ScrollView contentContainerStyle={authStyles.container}>
        <View style={commonStyles.flexRowBetween}>
            <Image source={require("@/src/assets/images/logo_t.png")} 
            />
            <TouchableOpacity style={authStyles.flexRowGap}>
                <MaterialIcons name="help" size={18} color="grey" />
                <CustomText fontFamily='Regular' variant='h7'>
                    Help
                </CustomText> 
            </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Auth