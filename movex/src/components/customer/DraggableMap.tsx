import { View, Text } from 'react-native'
import React, { FC, useRef, useState } from 'react'
import { useIsFocused } from '@react-navigation/native'
import { useUserStore } from '@/src/store/userStore';
import MapView, { Marker, Region } from 'react-native-maps'
import { customMapStyle, indiaIntialRegion } from '@/src/utils/CustomMap';
import { reverseGeocode } from '@/src/utils/mapUtils';
import { useWS } from '@/src/services/WSProvider';

const DraggableMap:FC<{ height: number }>  = ({ height }) => {

    const isFocused = useIsFocused();
    const [markers, setMarkers] = useState<any>([]);
    const mapRef = useRef<MapView>(null);
    const { emit, on, off } = useWS();
    const { setLocation, location, outOfRange, setOutOfRange } = useUserStore();
    const MAX_DISTANCE_THERESHOLD = 10000;


    const handleRegionChangeCompleted = async (newRegion: Region) => {
        const address = await reverseGeocode(newRegion.latitude, newRegion.longitude)

        setLocation({
        latitude: newRegion.latitude,
        longitude: newRegion.longitude
        onPress: addPress,
         });
         const userLocation = {
            latitude: location?.latitude,
            longitude: location?.longitude
         } as any;
         if(userLocation){
            const newLocation = {
            latitude: location?.latitude,
            longitude: location?.longitude
         };
         const distance = harvesine(userLocation, newLocation);
         setOutOfRange(distance > MAX_DISTANCE_THERESHOLD)
    }
};



  return (
    <View style={{ height: height, width: "100%" }}>
      <MapView
      ref={mapRef}
      maxZoomLevel={16}
      minZoomLevel={12}
      pitchEnabled={false}
      onRegionChangeComplete={handleRegionChangeCompleted}
      style={{flex: 1}}
      initialRegion={indiaIntialRegion}
      provider='google'
      showsMyLocationButton={false}
      showsCompass={false}
      showsIndoors={false}
      showsIndoorLevelPicker={false}
      showsTraffic={false}
      showsScale={false}
      showsBuildings={false}
      showsPointsOfInterests={false}
      customMapStyle={customMapStyle}
      showsUserLocation={true}
      >
        
      </MapView>
    </View>
  )
}

export default DraggableMap