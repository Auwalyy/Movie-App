import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import React, { FC } from 'react'
import { Colors } from '../../utils/Constants'
import CustomText from './CustomText'
import { RFValue } from 'react-native-responsive-fontsize'

interface CustomButtonProps {
    title: string;
    loading?: boolean;
    onPress?: () => void
    disabled?: boolean
}

const CustomButton: FC<CustomButtonProps> = ({ 
    onPress, 
    title, 
    disabled, 
    loading 
}) => {
  return (
    <TouchableOpacity 
     onPress={onPress}
     activeOpacity={0.8}
     style={[
        styles.container,
        {
            backgroundColor: disabled ? Colors.secondary : Colors.primary
        },
     ]}
    >
      {loading ? (
        <ActivityIndicator color={Colors.text} size="small" />
        ) : (  <CustomText 
            fontFamily='Bold'
            style={{
                fontSize: RFValue(12),
                color: disabled ? "#fff" : Colors.text
            }}
        >
            {title}
        </CustomText>
      )}
    </TouchableOpacity>
  )
}


export default CustomButton;

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        margin: 10,
        padding: 10,
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    }
})