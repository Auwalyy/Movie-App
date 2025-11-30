import { Text, View, Image, TouchableOpacity, TextInput } from 'react-native'
import { icons } from '@/constants/icons'

interface Props {
  placeholder: string;
  onPress: () => void;
  value: String;
  onChangeText: () => void;
}

const SearchBar = ({ placeholder, onPress, value, onChangeText }: Props) => {
  return (
    <View
      className="flex-row items-center bg-dark-200 rounded-full px-5 py-4"
    >
      <Image
        source={icons.search}
        className="size-5"
        resizeMode="contain"
        tintColor="#ab8bff"
      />
      <TextInput 
      onPress={onPress}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor="#ABB5DB"
      className='flex-1 ml-2 text-white'
      />

      <Text className="ml-3 flex-1 text-[#ABB5DB]">{placeholder}</Text>
    </View>
  )
}

export default SearchBar;
