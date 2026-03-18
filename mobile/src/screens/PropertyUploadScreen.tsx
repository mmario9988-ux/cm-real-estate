import React, { useState, useCallback, useRef, useEffect } from 'react';
// DEV_REFRESH: Resolve resolution issue
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  Image, Alert, ActivityIndicator, Dimensions, Platform, Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import client from '../api/client';
import axios from 'axios';
import { Camera, Image as ImageIcon, X, Plus, Save, ChevronLeft, CheckCircle } from 'lucide-react-native';
import { iconProps } from '../components/iconUtils';

const { width: W } = Dimensions.get('window');

type Nav = NativeStackNavigationProp<RootStackParamList, 'PropertyUpload'>;
type Route = RouteProp<RootStackParamList, 'PropertyUpload'>;

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dcsnbthca/image/upload';
const UPLOAD_PRESET = 'cm_real_estate';

export default function PropertyUploadScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<Route>();
  const lastResetKey = useRef<number>(0);
  console.log('PropertyUploadScreen Render, resetKey:', route.params?.resetKey);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('For Rent');
  const [type, setType] = useState('House');
  const [description, setDescription] = useState('');
  const [bedrooms, setBedrooms] = useState('2');
  const [bathrooms, setBathrooms] = useState('2');
  const [area, setArea] = useState('');
  const [furniture, setFurniture] = useState('none');
  const [appliances, setAppliances] = useState('none');
  const [airconCount, setAirconCount] = useState('0');
  const [waterHeaterCount, setWaterHeaterCount] = useState('0');
  const [parkingCount, setParkingCount] = useState('1');
  const [petsAllowed, setPetsAllowed] = useState('0');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [showSuccessUI, setShowSuccessUI] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    console.log('User session state:', user);
  }, [user]);

  useEffect(() => {
    const rKey = route.params?.resetKey;
    if (rKey && rKey !== lastResetKey.current) {
      console.log('Action: Resetting form (New ResetKey detected:', rKey, ')');
      lastResetKey.current = rKey;
      resetForm();
    }
  }, [route.params?.resetKey]);

  const checkUser = async () => {
    const userData = await AsyncStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  };

  const pickImage = async (useCamera: boolean) => {
    let result;
    if (useCamera) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'We need camera access to take photos.');
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    console.log('Starting upload for URI:', uri);
    setLoading(true);
    try {
      const formData = new FormData();
      const filename = uri.split('/').pop() || 'upload.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      if (Platform.OS === 'web') {
        const response = await fetch(uri);
        const blob = await response.blob();
        formData.append('file', blob, filename);
      } else {
        // @ts-ignore
        formData.append('file', { uri, name: filename, type });
      }
      
      formData.append('upload_preset', UPLOAD_PRESET);
      console.log('Sending to Cloudinary:', CLOUDINARY_URL);

      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const resData = await response.json();
      console.log('Upload success:', resData.secure_url);
      setImages(prev => [...prev, resData.secure_url]);
    } catch (e: any) {
      console.error('Upload Error Details:', e.message);
      Alert.alert('Upload Error', 'Failed to upload image. ' + (e.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    console.log('resetForm() called');
    setImages([]);
    setTitle('');
    setPrice('');
    setLocation('');
    setStatus('For Rent');
    setType('House');
    setDescription('');
    setBedrooms('2');
    setBathrooms('2');
    setArea('');
    setFurniture('none');
    setAppliances('none');
    setAirconCount('0');
    setWaterHeaterCount('0');
    setParkingCount('1');
    setPetsAllowed('0');
    setGoogleMapsUrl('');
    setYoutubeUrl('');
    setIsFeatured(false);
    setErrorMsg(null);
  };

  const handleSave = async () => {
    if (!title || !price || !location || images.length === 0) {
      console.log('Validation failed:', { title, price, location, imgCount: images.length });
      setErrorMsg('กรุณากรอกข้อมูลที่จำเป็น (*) และเพิ่มรูปภาพอย่างน้อย 1 รูป');
      return;
    }

    if (!user?.email) {
      console.log('Auth check failed: User email missing');
      setErrorMsg('ไม่พบข้อมูลการเข้าใช้งาน กรุณาเข้าสู่ระบบใหม่อีกครั้ง');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      await client.post('/properties', {
        title,
        price,
        location,
        status,
        type,
        description,
        bedrooms,
        bathrooms,
        area,
        furniture,
        appliances,
        airconCount,
        waterHeaterCount,
        parkingCount,
        petsAllowed,
        googleMapsUrl,
        youtubeUrl,
        isFeatured,
        images: JSON.stringify(images),
      }, {
        headers: { 'x-admin-email': user.email }
      });

      console.log('Save success, resetting form...');
      resetForm();
      setShowSuccessUI(true);
    } catch (e: any) {
      console.error('Save error:', e.response?.data || e.message);
      setErrorMsg('ไม่สามารถบันทึกข้อมูลได้: ' + (e.response?.data?.error || e.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const removeImg = (url: string) => {
    setImages(images.filter(img => img !== url));
  };

  return (
    <View style={s.root}>
      <ScrollView style={s.scroll}>
        <View style={s.container}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <Text style={[s.groupLabel, { marginBottom: 0 }]}>Property Photos</Text>
            <TouchableOpacity onPress={resetForm}>
              <Text style={{ color: '#dc2626', fontSize: 12, fontFamily: 'Prompt_600SemiBold' }}>ล้างข้อมูลทั้งหมด</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.imgScroll}>
            <TouchableOpacity style={s.addImgBtn} onPress={() => pickImage(true)}>
              <Camera {...iconProps(24, '#64748b')} />
              <Text style={s.addImgTxt}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.addImgBtn} onPress={() => pickImage(false)}>
              <ImageIcon {...iconProps(24, '#64748b')} />
              <Text style={s.addImgTxt}>Gallery</Text>
            </TouchableOpacity>
            
            {images.map((img, idx) => (
              <View key={idx} style={s.imgWrap}>
                <Image source={{ uri: img }} style={s.img} />
                <TouchableOpacity style={s.imgDel} onPress={() => removeImg(img)}>
                  <X {...iconProps(14, '#fff')} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View style={s.form}>
            <Text style={s.label}>Property Title *</Text>
            <TextInput 
              style={s.input} 
              placeholder="e.g. Modern Villa with Pool" 
              value={title}
              onChangeText={setTitle}
            />

            <View style={s.row}>
              <View style={{ flex: 1 }}>
                <Text style={s.label}>Price (Baht) *</Text>
                <TextInput 
                  style={s.input} 
                  placeholder="e.g. 5500000" 
                  keyboardType="numeric"
                  value={price}
                  onChangeText={setPrice}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.label}>Status</Text>
                <View style={s.picker}>
                  <TouchableOpacity onPress={() => setStatus('For Rent')} style={[s.pickBtn, status === 'For Rent' && s.pickActive]}>
                    <Text style={[s.pickTxt, status === 'For Rent' && s.pickTxtActive]}>Rent</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setStatus('For Sale')} style={[s.pickBtn, status === 'For Sale' && s.pickActive]}>
                    <Text style={[s.pickTxt, status === 'For Sale' && s.pickTxtActive]}>Sale</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <Text style={s.label}>Location / Zone *</Text>
            <TextInput 
              style={s.input} 
              placeholder="e.g. Nimman, Chiang Mai" 
              value={location}
              onChangeText={setLocation}
            />

            <View style={s.row}>
              <View style={{ flex: 1 }}>
                <Text style={s.label}>Bedrooms</Text>
                <TextInput 
                  style={s.input} 
                  placeholder="2" 
                  keyboardType="numeric"
                  value={bedrooms}
                  onChangeText={setBedrooms}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.label}>Bathrooms</Text>
                <TextInput 
                  style={s.input} 
                  placeholder="2" 
                  keyboardType="numeric"
                  value={bathrooms}
                  onChangeText={setBathrooms}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.label}>Area (sqm)</Text>
                <TextInput 
                  style={s.input} 
                  placeholder="120" 
                  keyboardType="numeric"
                  value={area}
                  onChangeText={setArea}
                />
              </View>
            </View>

            <Text style={s.label}>Property Type</Text>
            <View style={s.tagWrap}>
              {['House', 'Condo', 'Townhouse', 'Land'].map(t => (
                <TouchableOpacity 
                  key={t} 
                  style={[s.tag, type === t && s.tagActive]}
                  onPress={() => setType(t)}
                >
                  <Text style={[s.tagTxt, type === t && s.tagTxtActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={s.label}>Description</Text>
            <TextInput 
              style={[s.input, s.area]} 
              placeholder="Tell us about the property..." 
              multiline 
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />

            {/* Facilities Section */}
            <Text style={s.label}>Facilities & Furniture</Text>
            <View style={s.row}>
              <View style={{ flex: 1 }}>
                <Text style={s.subLabel}>Furniture</Text>
                <View style={s.picker}>
                  <TouchableOpacity onPress={() => setFurniture('full')} style={[s.pickBtn, furniture === 'full' && s.pickActive]}>
                    <Text style={[s.pickTxt, furniture === 'full' && s.pickTxtActive]}>Full</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setFurniture('none')} style={[s.pickBtn, furniture === 'none' && s.pickActive]}>
                    <Text style={[s.pickTxt, furniture === 'none' && s.pickTxtActive]}>None</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.subLabel}>Appliances</Text>
                <View style={s.picker}>
                  <TouchableOpacity onPress={() => setAppliances('full')} style={[s.pickBtn, appliances === 'full' && s.pickActive]}>
                    <Text style={[s.pickTxt, appliances === 'full' && s.pickTxtActive]}>Full</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setAppliances('none')} style={[s.pickBtn, appliances === 'none' && s.pickActive]}>
                    <Text style={[s.pickTxt, appliances === 'none' && s.pickTxtActive]}>None</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={s.row}>
              <View style={{ flex: 1 }}>
                <Text style={s.subLabel}>Air Cons</Text>
                <TextInput style={s.input} keyboardType="numeric" value={airconCount} onChangeText={setAirconCount} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.subLabel}>Water Heaters</Text>
                <TextInput style={s.input} keyboardType="numeric" value={waterHeaterCount} onChangeText={setWaterHeaterCount} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.subLabel}>Parking</Text>
                <TextInput style={s.input} keyboardType="numeric" value={parkingCount} onChangeText={setParkingCount} />
              </View>
            </View>

            {/* Extra Info */}
            <Text style={s.label}>Extra Details</Text>
            <View style={s.row}>
              <View style={{ flex: 1 }}>
                <Text style={s.subLabel}>Allow Pets (0=No, 1=Yes)</Text>
                <TextInput style={s.input} keyboardType="numeric" value={petsAllowed} onChangeText={setPetsAllowed} />
              </View>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={s.subLabel}>Featured?</Text>
                <TouchableOpacity 
                  onPress={() => setIsFeatured(!isFeatured)}
                  style={[s.pickBtn, isFeatured && { backgroundColor: '#111827' }, { height: 50, borderRadius: 12, borderWidth: 1, borderColor: '#f1f5f9' }]}
                >
                  <Text style={[s.pickTxt, isFeatured && { color: '#fff' }]}>{isFeatured ? 'YES' : 'NO'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={s.label}>Google Maps URL</Text>
            <TextInput style={s.input} placeholder="https://maps.google.com/..." value={googleMapsUrl} onChangeText={setGoogleMapsUrl} />
            
            <Text style={s.label}>YouTube Video URL</Text>
            <TextInput style={s.input} placeholder="https://youtube.com/..." value={youtubeUrl} onChangeText={setYoutubeUrl} />
          </View>
        </View>
      </ScrollView>

      <View style={s.footer}>
          <TouchableOpacity style={s.saveBtn} onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : (
            <>
              <Save {...iconProps(20, '#fff')} />
              <Text style={s.saveBtnTxt}>ลงประกาศทันที</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Success Modal Overlay */}
      <Modal
        visible={showSuccessUI}
        transparent={true}
        animationType="fade"
      >
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.successIconWrap}>
              <CheckCircle {...iconProps(60, '#10b981')} />
            </View>
            <Text style={s.modalTitle}>บันทึกสำเร็จ (Success)</Text>
            <Text style={s.modalSub}>ข้อมูลอสังหาริมทรัพย์ของคุณถูกบันทึกเรียบร้อยแล้ว!</Text>
            
            <View style={s.modalActions}>
              <TouchableOpacity 
                style={s.modalBtnPrimary}
                onPress={() => setShowSuccessUI(false)}
              >
                <Text style={s.modalBtnPrimaryTxt}>เพิ่มรายการอื่น</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={s.modalBtnSecondary}
                onPress={() => {
                  setShowSuccessUI(false);
                  nav.replace('AgentDashboard');
                }}
              >
                <Text style={s.modalBtnSecondaryTxt}>กลับหน้าหลัก</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  scroll: { flex: 1 },
  container: { padding: 24 },
  groupLabel: { fontSize: 13, fontFamily: 'Prompt_700Bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 20 },
  imgScroll: { marginBottom: 30 },
  addImgBtn: { 
    width: 100, height: 100, borderRadius: 24, 
    borderWidth: 1, borderStyle: 'dashed', borderColor: '#e2e8f0',
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
    backgroundColor: '#fafafa'
  },
  addImgTxt: { fontSize: 11, fontFamily: 'Prompt_500Medium', color: '#94a3b8', marginTop: 8 },
  imgWrap: { width: 100, height: 100, borderRadius: 24, marginRight: 14, overflow: 'hidden', backgroundColor: '#f1f5f9' },
  img: { width: '100%', height: '100%' },
  imgDel: { position: 'absolute', top: 6, right: 6, width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(15, 23, 42, 0.9)', justifyContent: 'center', alignItems: 'center' },
  form: { gap: 20 },
  label: { fontSize: 14, fontFamily: 'Prompt_600SemiBold', color: '#0f172a', marginTop: 12 },
  subLabel: { fontSize: 12, fontFamily: 'Prompt_500Medium', color: '#94a3b8', marginBottom: 6 },
  input: { 
    backgroundColor: '#fff', borderRadius: 16, 
    borderWidth: 1, borderColor: '#f1f5f9', 
    paddingHorizontal: 18, paddingVertical: 15,
    fontSize: 15, fontFamily: 'Prompt', color: '#0f172a'
  },
  row: { flexDirection: 'row', gap: 16 },
  area: { height: 140, textAlignVertical: 'top' },
  picker: { flexDirection: 'row', backgroundColor: '#f8fafc', borderRadius: 14, padding: 4, height: 50 },
  pickBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 11 },
  pickActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  pickTxt: { fontSize: 13, fontFamily: 'Prompt_500Medium', color: '#94a3b8' },
  pickTxtActive: { color: '#0f172a' },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tag: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: '#f1f5f9' },
  tagActive: { borderColor: '#0f172a', backgroundColor: '#0f172a' },
  tagTxt: { fontSize: 13, fontFamily: 'Prompt_500Medium', color: '#64748b' },
  tagTxtActive: { color: '#fff' },
  footer: { padding: 24, borderTopWidth: 1, borderTopColor: '#f8fafc', backgroundColor: '#fff' },
  saveBtn: { 
    backgroundColor: '#0f172a', height: 60, borderRadius: 20, 
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12,
    shadowColor: '#0f172a', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10
  },
  saveBtnTxt: { color: '#fff', fontSize: 16, fontFamily: 'Prompt_700Bold', letterSpacing: 0.5 },
  
  // Modal Styles
  modalOverlay: { 
    flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.8)', 
    justifyContent: 'center', alignItems: 'center', padding: 20 
  },
  modalContent: { 
    backgroundColor: '#fff', width: '100%', maxWidth: 400, 
    borderRadius: 32, padding: 30, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.3, shadowRadius: 20, elevation: 12
  },
  successIconWrap: { 
    width: 100, height: 100, backgroundColor: '#f0fdf4', 
    borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 20 
  },
  modalTitle: { fontSize: 22, fontFamily: 'Prompt_700Bold', color: '#0f172a', marginBottom: 10 },
  modalSub: { fontSize: 14, fontFamily: 'Prompt_500Medium', color: '#64748b', textAlign: 'center', marginBottom: 30 },
  modalActions: { width: '100%', gap: 12 },
  modalBtnPrimary: { 
    backgroundColor: '#111827', height: 56, borderRadius: 16, 
    justifyContent: 'center', alignItems: 'center' 
  },
  modalBtnPrimaryTxt: { color: '#fff', fontSize: 15, fontFamily: 'Prompt_700Bold' },
  modalBtnSecondary: { 
    backgroundColor: '#f1f5f9', height: 56, borderRadius: 16, 
    justifyContent: 'center', alignItems: 'center' 
  },
  modalBtnSecondaryTxt: { color: '#475569', fontSize: 15, fontFamily: 'Prompt_700Bold' }
});
