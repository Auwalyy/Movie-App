import { StyleSheet, Text, View, Image, TextInput } from 'react-native'
import { icons } from '@/constants/icons'

const SearchBar = () => {
  return (
    <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
      <Image source={icons.search}  className="size-5" resizeMode="contain" tintColor="#ab8bff" />
     <TextInput 
      onPress={() => {}}
      placeholder='Search'
      value=""
      onChangeText={() => {}}
      placeholderTextColor="#ABB5DB"
      className='flex'
     />
    </View>
  )
}

export default SearchBar

