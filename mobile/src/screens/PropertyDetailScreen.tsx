import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
  ActivityIndicator, Dimensions, Linking, Alert
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Property, RootStackParamList } from '../types';
import client from '../api/client';
import { iconProps } from '../components/iconUtils';
import {
  Bed, Bath, Maximize, MapPin, Phone, Heart, Share2,
  Car, Snowflake, Droplets, PawPrint, Sofa, Tv, Star,
  ChevronLeft, ChevronRight, ExternalLink, Play
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type DetailRouteProp = RouteProp<RootStackParamList, 'PropertyDetail'>;

const PropertyDetailScreen = () => {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, []);

  const fetchProperty = async () => {
    try {
      const response = await client.get(`/properties/${route.params.id}`);
      setProperty(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'ไม่สามารถโหลดข้อมูลทรัพย์ได้');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#950000" />
        <Text style={styles.loadingText}>กำลังโหลดข้อมูล...</Text>
      </View>
    );
  }

  if (!property) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>ไม่พบข้อมูลทรัพย์</Text>
      </View>
    );
  }

  const images: string[] = JSON.parse(property.images || '[]');
  const features: string[] = JSON.parse(property.features || '[]');

  const nextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const openMaps = () => {
    if (property.googleMapsUrl) {
      Linking.openURL(property.googleMapsUrl);
    } else if (property.lat && property.lng) {
      Linking.openURL(`https://www.google.com/maps?q=${property.lat},${property.lng}`);
    }
  };

  const openYoutube = () => {
    if (property.youtubeUrl) {
      Linking.openURL(property.youtubeUrl);
    }
  };

  const shareProperty = () => {
    Alert.alert('แชร์', `${property.title}\n฿${property.price.toLocaleString()}\n${property.location}`);
  };

  const contactAgent = () => {
    Alert.alert(
      'ติดต่อตัวแทน',
      `สนใจทรัพย์: ${property.title}`,
      [
        { text: 'ยกเลิก', style: 'cancel' },
        { text: 'โทร', onPress: () => Linking.openURL('tel:+66123456789') },
      ]
    );
  };

  const getFurnitureLabel = (val?: string) => {
    switch (val) {
      case 'full': return 'เฟอร์ครบ';
      case 'partial': return 'เฟอร์บางส่วน';
      default: return 'ไม่มีเฟอร์';
    }
  };

  const getAppliancesLabel = (val?: string) => {
    switch (val) {
      case 'full': return 'เครื่องใช้ครบ';
      case 'partial': return 'บางส่วน';
      default: return 'ไม่มี';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          {images.length > 0 ? (
            <>
              <Image source={{ uri: images[currentImageIndex] }} style={styles.mainImage} />
              {images.length > 1 && (
                <>
                  <TouchableOpacity style={[styles.navBtn, styles.navBtnLeft]} onPress={prevImage}>
                    <ChevronLeft {...iconProps(24, '#fff')} />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.navBtn, styles.navBtnRight]} onPress={nextImage}>
                    <ChevronRight {...iconProps(24, '#fff')} />
                  </TouchableOpacity>
                  <View style={styles.imageCounter}>
                    <Text style={styles.imageCounterText}>
                      {currentImageIndex + 1} / {images.length}
                    </Text>
                  </View>
                </>
              )}
            </>
          ) : (
            <View style={[styles.mainImage, styles.noImage]}>
              <Text style={styles.noImageText}>ไม่มีรูปภาพ</Text>
            </View>
          )}

          {/* Back button */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ChevronLeft {...iconProps(28, '#fff')} />
          </TouchableOpacity>

          {/* Favorite & Share */}
          <View style={styles.topActions}>
            <TouchableOpacity
              style={styles.actionCircle}
              onPress={() => setIsFav(!isFav)}
            >
              <Heart {...iconProps(20, isFav ? '#ff4444' : '#fff')} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCircle} onPress={shareProperty}>
              <Share2 {...iconProps(20, '#fff')} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Price & Status Badge */}
        <View style={styles.priceSection}>
          <View>
            <Text style={styles.price}>฿{property.price.toLocaleString()}</Text>
            <Text style={styles.priceUnit}>
              {property.type === 'rent' || property.type === 'เช่า' ? '/เดือน' : ''}
            </Text>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: property.status === 'Available' ? '#4CAF50' : '#FF9800' }
          ]}>
            <Text style={styles.statusText}>
              {property.status === 'Available' ? 'ว่าง' : property.status}
            </Text>
          </View>
        </View>

        {/* Title & Location */}
        <View style={styles.infoSection}>
          {property.isFeatured && (
            <View style={styles.featuredBadge}>
              <Star {...iconProps(14, '#FFD700')} />
              <Text style={styles.featuredText}>แนะนำ</Text>
            </View>
          )}
          <Text style={styles.title}>{property.title}</Text>
          <TouchableOpacity style={styles.locationRow} onPress={openMaps}>
            <MapPin {...iconProps(16, '#950000')} />
            <Text style={styles.locationText}>{property.location}</Text>
            <ExternalLink {...iconProps(14, '#999')} />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Bed {...iconProps(22, '#950000')} />
            <Text style={styles.statValue}>{property.bedrooms}</Text>
            <Text style={styles.statLabel}>ห้องนอน</Text>
          </View>
          <View style={styles.statBox}>
            <Bath {...iconProps(22, '#950000')} />
            <Text style={styles.statValue}>{property.bathrooms}</Text>
            <Text style={styles.statLabel}>ห้องน้ำ</Text>
          </View>
          {property.area && (
            <View style={styles.statBox}>
              <Maximize {...iconProps(22, '#950000')} />
              <Text style={styles.statValue}>{property.area}</Text>
              <Text style={styles.statLabel}>ตร.ม.</Text>
            </View>
          )}
          {(property.parkingCount ?? 0) > 0 && (
            <View style={styles.statBox}>
              <Car {...iconProps(22, '#950000')} />
              <Text style={styles.statValue}>{property.parkingCount}</Text>
              <Text style={styles.statLabel}>ที่จอดรถ</Text>
            </View>
          )}
        </View>

        {/* Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>สิ่งอำนวยความสะดวก</Text>
          <View style={styles.amenitiesGrid}>
            <View style={styles.amenityItem}>
              <Sofa {...iconProps(18, '#555')} />
              <Text style={styles.amenityText}>{getFurnitureLabel(property.furniture)}</Text>
            </View>
            <View style={styles.amenityItem}>
              <Tv {...iconProps(18, '#555')} />
              <Text style={styles.amenityText}>{getAppliancesLabel(property.appliances)}</Text>
            </View>
            {(property.airconCount ?? 0) > 0 && (
              <View style={styles.amenityItem}>
                <Snowflake {...iconProps(18, '#555')} />
                <Text style={styles.amenityText}>แอร์ {property.airconCount} เครื่อง</Text>
              </View>
            )}
            {(property.waterHeaterCount ?? 0) > 0 && (
              <View style={styles.amenityItem}>
                <Droplets {...iconProps(18, '#555')} />
                <Text style={styles.amenityText}>เครื่องทำน้ำอุ่น {property.waterHeaterCount}</Text>
              </View>
            )}
            {(property.petsAllowed ?? 0) > 0 && (
              <View style={styles.amenityItem}>
                <PawPrint {...iconProps(18, '#4CAF50')} />
                <Text style={[styles.amenityText, { color: '#4CAF50' }]}>เลี้ยงสัตว์ได้</Text>
              </View>
            )}
          </View>
        </View>

        {/* Features */}
        {features.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>จุดเด่น</Text>
            <View style={styles.featuresList}>
              {features.map((f, index) => (
                <View key={index} style={styles.featureChip}>
                  <Text style={styles.featureChipText}>{f}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>รายละเอียด</Text>
          <Text style={styles.description}>{property.description}</Text>
        </View>

        {/* YouTube Link */}
        {property.youtubeUrl && (
          <TouchableOpacity style={styles.youtubeBtn} onPress={openYoutube}>
            <Play {...iconProps(20, '#fff')} />
            <Text style={styles.youtubeBtnText}>ดูวิดีโอ Tour</Text>
          </TouchableOpacity>
        )}

        {/* Map Link */}
        {(property.googleMapsUrl || (property.lat && property.lng)) && (
          <TouchableOpacity style={styles.mapBtn} onPress={openMaps}>
            <MapPin {...iconProps(20, '#950000')} />
            <Text style={styles.mapBtnText}>เปิดแผนที่</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Contact Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.contactBtn} onPress={contactAgent}>
          <Phone {...iconProps(20, '#fff')} />
          <Text style={styles.contactBtnText}>ติดต่อตัวแทน</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontFamily: 'Prompt_400Regular',
    color: '#666',
    fontSize: 15,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Prompt_400Regular',
    color: '#999',
  },

  // Image Gallery
  imageContainer: {
    position: 'relative',
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.75,
    backgroundColor: '#111',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  noImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  noImageText: {
    color: '#999',
    fontSize: 16,
    fontFamily: 'Prompt_400Regular',
  },
  navBtn: {
    position: 'absolute',
    top: '45%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBtnLeft: { left: 12 },
  navBtnRight: { right: 12 },
  imageCounter: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  imageCounterText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Prompt_600SemiBold',
  },
  backBtn: {
    position: 'absolute',
    top: 48,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topActions: {
    position: 'absolute',
    top: 48,
    right: 16,
    flexDirection: 'row',
    gap: 10,
  },
  actionCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Price
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 8,
  },
  price: {
    fontSize: 28,
    fontFamily: 'Prompt_700Bold',
    color: '#dc2626',
  },
  priceUnit: {
    fontSize: 13,
    fontFamily: 'Prompt_400Regular',
    color: '#888',
    marginTop: -2,
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontFamily: 'Prompt_700Bold',
    fontSize: 13,
  },

  // Info
  infoSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  featuredText: {
    fontSize: 12,
    fontFamily: 'Prompt_700Bold',
    color: '#F57F17',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Prompt_700Bold',
    color: '#111827',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 15,
    fontFamily: 'Prompt_400Regular',
    color: '#555',
    flex: 1,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    marginHorizontal: 20,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Prompt_700Bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Prompt_400Regular',
    color: '#888',
  },

  // Section
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Prompt_700Bold',
    color: '#111827',
    marginBottom: 12,
  },

  // Amenities
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  amenityText: {
    fontSize: 14,
    fontFamily: 'Prompt_400Regular',
    color: '#555',
  },

  // Features
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureChip: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  featureChipText: {
    fontSize: 13,
    color: '#dc2626',
    fontFamily: 'Prompt_600SemiBold',
  },

  // Description
  description: {
    fontSize: 15,
    fontFamily: 'Prompt_400Regular',
    color: '#444',
    lineHeight: 24,
  },

  // YouTube
  youtubeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FF0000',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
  },
  youtubeBtnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Prompt_700Bold',
  },

  // Map
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#dc2626',
    marginHorizontal: 20,
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
  },
  mapBtnText: {
    color: '#dc2626',
    fontSize: 16,
    fontFamily: 'Prompt_700Bold',
  },

  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#dc2626',
    padding: 16,
    borderRadius: 14,
  },
  contactBtnText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Prompt_700Bold',
  },
});

export default PropertyDetailScreen;
