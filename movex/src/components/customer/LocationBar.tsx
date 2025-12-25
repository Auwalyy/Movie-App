import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import { uiStyles } from '@/src/styles/uiStyles'
import { logout } from '@/src/services/authService'
import { RFValue } from 'react-native-responsive-fontsize'
import { Colors } from '@/src/utils/Constants'
import { useWS } from '@/src/services/WSProvider'
import CustomText from '../shared/CustomText'
import { useUserStore } from '../../store/userStore'
import AntDesign from '@expo/vector-icons/AntDesign'


const LocationBar = () => {

    const {disconnect} = useWS();
    const { location } = useUserStore();


  return (
    <View style={uiStyles.absoluteTop}>
        <SafeAreaView />
            <View style={uiStyles.container}>
                <TouchableOpacity style={uiStyles.btn} onPress={() => logout(disconnect)}>
                      <AntDesign name="poweroff" size={RFValue(24)} color={Colors.text} />
                </TouchableOpacity>

                <TouchableOpacity style={uiStyles.locationBar}
                onPress={() => router.navigate('/customer/selectLocations')}
                >
                  <View style={uiStyles.dot} />
                  <CustomText numberOfLines={1} style={uiStyles.locationText}>
                    {location?.address || "Getten address..."}
                  </CustomText>
                </TouchableOpacity>
           </View>
      
    </View>
  )
}

export default LocationBar