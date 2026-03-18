import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Property, RootStackParamList } from '../types';
import client from '../api/client';
import { Bed, Bath, Maximize } from 'lucide-react-native';
import { iconProps } from '../components/iconUtils';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'PropertyList'>;

const PropertyListScreen = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp>();

  const { params } = useRoute<any>();

  useEffect(() => {
    fetchProperties();
  }, [params]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (params?.q) queryParams.append('q', params.q);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.type) queryParams.append('type', params.type);
      if (params?.location) queryParams.append('location', params.location);
      if (params?.minPrice) queryParams.append('minPrice', params.minPrice);
      if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice);
      if (params?.bedrooms) queryParams.append('bedrooms', params.bedrooms);
      
      // Handle legacy 'filter' param if still used
      if (params?.filter) {
        if (params.filter === 'rent') queryParams.append('status', 'For Rent');
        if (params.filter === 'sale') queryParams.append('status', 'For Sale');
      }

      const response = await client.get(`/properties?${queryParams.toString()}`);
      setProperties(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Property }) => {
    const images = JSON.parse(item.images || '[]');
    const coverImage = images[0] || 'https://via.placeholder.com/400x300';

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('PropertyDetail', { id: item.id })}
      >
        <Image source={{ uri: coverImage }} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.price}>฿{item.price.toLocaleString()}</Text>
          <Text style={styles.location}>{item.location}</Text>
          
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Bed {...iconProps(16, '#666')} />
              <Text style={styles.statText}>{item.bedrooms}</Text>
            </View>
            <View style={styles.statItem}>
              <Bath {...iconProps(16, '#666')} />
              <Text style={styles.statText}>{item.bathrooms}</Text>
            </View>
            {item.area && (
              <View style={styles.statItem}>
                <Maximize {...iconProps(16, '#666')} />
                <Text style={styles.statText}>{item.area} ตร.ม.</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#950000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={properties}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
  },
  details: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Prompt_700Bold',
    color: '#111827',
  },
  price: {
    fontSize: 20,
    fontFamily: 'Prompt_700Bold',
    color: '#dc2626',
    marginVertical: 4,
  },
  location: {
    fontSize: 14,
    fontFamily: 'Prompt_400Regular',
    color: '#666',
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    fontFamily: 'Prompt_400Regular',
    color: '#666',
  }
});

export default PropertyListScreen;
