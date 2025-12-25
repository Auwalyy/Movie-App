import { 
  StyleSheet, 
  TextInput, 
  View, 
  TextInputProps,
  ViewStyle,
  TextStyle 
} from 'react-native'
import React, { FC } from 'react'
import { RFValue } from 'react-native-responsive-fontsize'
import CustomText from './CustomText'

 export interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const PhoneInput: FC<PhoneInputProps> = ({
  value,
  onChangeText,
  onBlur,
  onFocus,

}) => {
  

  return (
   <View style={styles.container}>
    <CustomText fontFamily='Regular' style={styles.text}>
        +234
    </CustomText>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      onFocus={onFocus}
      placeholder="000 000 0000"
      keyboardType='phone-pad'
      maxLength={11}
      placeholderTextColor={"#ccc"}
      style={styles.input}
    />
   </View>
  )
}

export default PhoneInput

const styles = StyleSheet.create({
 container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 0,
    paddingHorizontal: 10,
    marginVertical: 15,
    gap: 4,
 },
 input: {
    fontSize: RFValue(14),
    fontFamily: 'Regular',
    height: 45,
    width: '90%',
 },
    text: {
    fontSize: RFValue(14),
    top: -1,
    fontFamily: 'Regular',
  } 
})