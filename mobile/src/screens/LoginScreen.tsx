import React, { useState } from 'react';
// DEV_REFRESH: Force update to resolve resolution issues
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
  ImageBackground
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import client from '../api/client';
import { LogIn, Mail, Lock, ChevronLeft } from 'lucide-react-native';
import { iconProps } from '../components/iconUtils';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

console.log('LOGIN_SCREEN_LOADED');

export default function LoginScreen() {
  const nav = useNavigation<Nav>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const res = await client.post('/auth/mobile-login', { email, password });
      
      // Store user session
      await AsyncStorage.setItem('user', JSON.stringify(res.data));
      
      Alert.alert('Success', `Welcome back, ${res.data.name}!`);
      nav.replace('AgentDashboard');
    } catch (e: any) {
      const msg = e.response?.data?.error || 'Login failed. Please check your credentials.';
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.root}>
      <ImageBackground 
        source={require('../../assets/images/hero-bg.png')} 
        style={s.bg}
      >
        <View style={s.overlay} />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={s.container}
        >
          <View style={s.card}>
            <View style={s.header}>
              <View style={s.iconBox}>
                <LogIn {...iconProps(32, '#dc2626')} />
              </View>
              <Text style={s.title}>Agent Login</Text>
              <Text style={s.subtitle}>เข้าสู่ระบบสำหรับตัวแทนและผู้ดูแล</Text>
            </View>

            <View style={s.form}>
              <View style={s.inputWrap}>
                <Mail {...iconProps(20, '#94a3b8')} style={s.inputIcon} />
                <TextInput
                  style={s.input}
                  placeholder="Email Address"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View style={s.inputWrap}>
                <Lock {...iconProps(20, '#94a3b8')} style={s.inputIcon} />
                <TextInput
                  style={s.input}
                  placeholder="Password"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity 
                style={[s.btn, loading && s.btnDisabled]} 
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={s.btnTxt}>เข้าสู่ระบบ</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity style={s.backBtn} onPress={() => nav.goBack()}>
            <ChevronLeft {...iconProps(20, '#fff')} />
            <Text style={s.backTxt}>กลับหน้าหลัก</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  bg: { flex: 1, justifyContent: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15,15,20,0.8)' },
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  header: { alignItems: 'center', marginBottom: 32 },
  iconBox: {
    width: 64, height: 64, borderRadius: 20,
    backgroundColor: '#fee2e2',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16
  },
  title: { fontSize: 24, fontFamily: 'Prompt_700Bold', color: '#111827' },
  subtitle: { fontSize: 14, fontFamily: 'Prompt_400Regular', color: '#64748b', marginTop: 4 },
  form: { gap: 16 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
  },
  inputIcon: { marginRight: 12 },
  input: {
    flex: 1,
    height: 56,
    color: '#111827',
    fontSize: 15,
    fontFamily: 'Prompt_500Medium',
  },
  btn: {
    backgroundColor: '#111827',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnDisabled: { opacity: 0.7 },
  btnTxt: { color: '#fff', fontSize: 16, fontFamily: 'Prompt_600SemiBold' },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 4
  },
  backTxt: { color: '#fff', fontSize: 14, fontFamily: 'Prompt_500Medium' }
});
