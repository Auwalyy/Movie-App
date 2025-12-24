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
  placeholder?: string;
  countryCode?: string;
  maxLength?: number;
  editable?: boolean;
  error?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  codeStyle?: TextStyle;
}

const PhoneInput: FC<PhoneInputProps> = ({
  value,
  onChangeText,
  onBlur,
  onFocus,
  placeholder = '+234 8000 400',
  countryCode = '+234',
  maxLength = 11,
  editable = true,
  error = false,
  containerStyle,
  inputStyle,
  codeStyle,
}) => {
  // Handle text change - ensure only numbers are entered
  const handleTextChange = (text: string) => {
    // Remove any non-numeric characters
    const numericText = text.replace(/[^0-9]/g, '');
    onChangeText(numericText);
  };

  return (
   <View style={styles.container}>
    <CustomText fontFamily='Regular' style={styles.text}>
        +234
    </CustomText>
   </View>
  )
}

export default PhoneInput

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    height: 56,
    marginVertical: 8,
  },
  errorContainer: {
    borderColor: "#FF3B30",
    backgroundColor: "#FFF5F5",
  },
  input: {
    fontSize: RFValue(16),
    fontFamily: "Regular",
    flex: 1,
    height: '100%',
    color: "#333333",
    paddingVertical: 0,
  },
  codeText: {
    fontSize: RFValue(16),
    fontFamily: "Regular",
    color: "#333333",
    minWidth: 40,
  },
  separator: {
    width: 1,
    height: 24,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 8,
  },
})