import { View, Text, Image, FlatList, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { images } from '@/constants/images'
import MovieCard from '@/components/MovieCard'
import { useRouter } from 'expo-router'
import useFetch from '@/services/useFetch'
import { fetchMovies } from '@/services/api'
import { icons } from '@/constants/icons'
import SearchBar from '@/components/SearchBar'

const search = () => {

  const [searchquery, setSearchQuery] = useState('');
  
    const router = useRouter();
  
    const { data: movies, loading: moviesLoading, error: moviesError } = useFetch(() => fetchMovies({
       query: '' 
    }),false)

  return (
    <View className='flex-1 bg-primary'>
      <Image source={images.bg} className="flex-1 absolute w-full z-0" resizeMode='cover' />

      <FlatList 
       data={movies} renderItem={({ item }) => <MovieCard  { ...item} />}
        keyExtractor={(item) => item.id.toString()}
        className='px-5'
        numColumns={3}
        columnWrapperStyle={{ justifyContent: 'center', gap: 16, marginVertical: 16 }}
        contentContainerStyle={{ paddingBottom: 100 }}

        ListHeaderComponent={
          <>
           <View className='w-full flex-row justify-center items-center mt-20'>
            <Image source={icons.logo} className='w-12 h-10' />
           </View>

           <View className="my-5">
            <SearchBar placeholder='search' 
             value={searchquery}
             onChangeText={}
            />
           </View>

           {moviesLoading && (
            <ActivityIndicator size="large"  
             color="#0000ff" className="my-3"
            />
           )}   {moviesError && (
            <Text className="text-red-500 px-5 my-3">Error : {moviesError.message}</Text>
           )}

           {!moviesLoading && !moviesError && searchquery.trim() && movies?.lenght > 0 && (
            <Text className="text-xs text-white font-bold">Search result for{''}
              <Text className="text-accent">{searchquery}</Text>
            </Text>
           )}
          </>
        }
      />
    </View>
  )
}

export default search