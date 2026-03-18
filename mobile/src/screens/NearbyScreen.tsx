import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as Location from 'expo-location';
import client from '../api/client';
import { Property } from '../types';
import { MapPin } from 'lucide-react-native';
import { iconProps } from '../components/iconUtils';

const NearbyScreen = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        const response = await client.get('/mobile/nearby', {
          params: {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
            radius: 20
          }
        });
        setProperties(response.data);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'ไม่สามารถดึงข้อมูลพิกัดรอบตัวได้');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#dc2626" />
        <Text style={styles.loadingText}>กำลังค้นหาทรัพย์รอบตัวคุณ...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MapPin {...iconProps(24, '#fff')} />
        <Text style={styles.headerTitle}>ทรัพย์ที่อยู่ใกล้คุณ (รัศมี 20 กม.)</Text>
      </View>
      
      {properties.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.noData}>ไม่พบทรัพย์ในบริเวณใกล้เคียง</Text>
        </View>
      ) : (
        <FlatList
          data={properties}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemPrice}>฿{item.price.toLocaleString()}</Text>
              <Text style={styles.itemLocation}>{item.location}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#dc2626',
    gap: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Prompt_700Bold',
  },
  loadingText: {
    marginTop: 12,
    fontFamily: 'Prompt_400Regular',
    color: '#666',
  },
  noData: {
    fontSize: 16,
    fontFamily: 'Prompt_400Regular',
    color: '#999',
    textAlign: 'center',
  },
  list: {
    padding: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: 'Prompt_700Bold',
    color: '#111827',
  },
  itemPrice: {
    fontSize: 18,
    color: '#dc2626',
    fontFamily: 'Prompt_700Bold',
    marginVertical: 2,
  },
  itemLocation: {
    fontSize: 13,
    fontFamily: 'Prompt_400Regular',
    color: '#666',
  }
});

export default NearbyScreen;
