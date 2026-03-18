import React, { useEffect, useState, useCallback } from 'react';
// DEV_REFRESH: Force resolution update
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, RefreshControl, Dimensions, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Property, Post } from '../types';
import client from '../api/client';
import { 
  Plus, Users, MessageSquare, Home, FileText, 
  TrendingUp, LogOut, ChevronRight, Eye 
} from 'lucide-react-native';
import { iconProps } from '../components/iconUtils';

const { width: W } = Dimensions.get('window');

type Nav = NativeStackNavigationProp<RootStackParamList, 'AgentDashboard'>;

interface Stats {
  properties: number;
  inquiries: number;
  pending: number;
  subscribers: number;
  posts: number;
}

export default function AgentDashboardScreen() {
  const nav = useNavigation<Nav>();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [topProps, setTopProps] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const userData = await AsyncStorage.getItem('user');
    if (!userData) {
      nav.replace('Login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
  };

  useFocusEffect(
    useCallback(() => {
      console.log('Dashboard Focused, attempting to load data...');
      if (user) {
        loadData();
      } else {
        checkUser(); // Ensure user is loaded if focus hits before mount useEffect
      }
    }, [user])
  );

  const loadData = useCallback(async (currentUser?: any) => {
    const activeUser = currentUser || user;
    if (!activeUser) {
      console.log('loadData skipped: No active user');
      return;
    }
    
    console.log('Fetching stats for:', activeUser.email);
    setLoading(true);
    try {
      const res = await client.get(`/admin/stats?t=${Date.now()}`, {
        headers: { 'x-admin-email': activeUser.email }
      });
      
      console.log('Stats received:', res.data?.stats?.properties);
      if (res.data && res.data.stats) {
        setStats(res.data.stats);
        setRecentLeads(res.data.recentInquiries || []);
        setTopProps(res.data.topProperties || []);
      }
    } catch (e: any) {
      console.error('Dashboard Error:', e.message);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    nav.replace('Login');
  };

  if (loading && !refreshing) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#dc2626" />
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={s.center}>
        <Text style={{ fontFamily: 'Prompt_500Medium', color: '#dc2626', marginBottom: 15 }}>ไม่สามารถเชื่อมต่อ Server ได้</Text>
        <TouchableOpacity 
          style={{ backgroundColor: '#111827', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 }} 
          onPress={() => { setError(false); loadData(); }}
        >
          <Text style={{ color: '#fff', fontFamily: 'Prompt_600SemiBold' }}>ลองใหม่อีกครั้ง</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={s.root}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} />}
    >
      <View style={s.header}>
        <View>
          <Text style={s.welcome}>Welcome back,</Text>
          <Text style={s.userName}>{user?.name || 'Agent'}</Text>
        </View>
        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
          <LogOut {...iconProps(20, '#64748b')} />
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={s.section}>
        <Text style={s.secTitle}>Quick Actions</Text>
        <View style={s.actionRow}>
          <TouchableOpacity 
            style={[s.actionBtn, { backgroundColor: '#dc2626' }]}
            onPress={() => nav.push('PropertyUpload', { fresh: true, resetKey: Date.now() })}
          >
            <Plus {...iconProps(24, '#fff')} />
            <Text style={s.actionTxt}>ลงประกาศใหม่</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[s.actionBtn, { backgroundColor: '#111827' }]}
            onPress={() => nav.navigate('LeadManagement')}
          >
            <Users {...iconProps(24, '#fff')} />
            <Text style={s.actionTxt}>จัดการลูกค้า</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={s.section}>
        <Text style={s.secTitle}>Overview</Text>
        <View style={s.statsGrid}>
          <StatCard icon={<Home {...iconProps(22, '#3b82f6')} />} label="Listings" value={stats?.properties || 0} iconBg="#eff6ff" />
          <StatCard icon={<MessageSquare {...iconProps(22, '#f59e0b')} />} label="Inquiries" value={stats?.inquiries || 0} iconBg="#fffbeb" />
          <StatCard icon={<Users {...iconProps(22, '#10b981')} />} label="Leads" value={stats?.pending || 0} iconBg="#ecfdf5" />
          <StatCard icon={<FileText {...iconProps(22, '#6366f1')} />} label="Articles" value={stats?.posts || 0} iconBg="#eef2ff" />
        </View>
      </View>

      {/* Recent Leads */}
      <View style={s.section}>
        <View style={s.secHeader}>
          <Text style={s.secTitle}>Recent Leads</Text>
          <TouchableOpacity onPress={() => nav.navigate('LeadManagement')}>
            <Text style={s.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={s.listCard}>
          {recentLeads.slice(0, 3).map((lead, i) => (
            <TouchableOpacity key={lead.id} style={[s.listItem, i === 2 && s.lastItem]}>
              <View style={s.leadThumb}>
                <Text style={s.leadInitial}>{lead.name[0]}</Text>
              </View>
              <View style={s.leadInfo}>
                <Text style={s.leadName}>{lead.name}</Text>
                <Text style={s.leadTime}>{new Date(lead.createdAt).toLocaleDateString()} • {lead.status}</Text>
              </View>
              <ChevronRight {...iconProps(18, '#cbd5e1')} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Top Properties */}
      <View style={s.section}>
        <Text style={s.secTitle}>Most Viewed Properties</Text>
        <View style={s.listCard}>
          {topProps.map((p, i) => (
            <View key={p.id} style={[s.listItem, i === topProps.length - 1 && s.lastItem]}>
              <View style={s.propInfo}>
                <Text style={s.propTitle} numberOfLines={1}>{p.title}</Text>
                <Text style={s.propLoc}>{p.location}</Text>
              </View>
              <View style={s.viewCount}>
                <Eye {...iconProps(14, '#64748b')} />
                <Text style={s.viewVal}>{p.viewCount}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const StatCard = ({ icon, label, value, color, iconBg }: any) => (
  <View style={[s.statCard, { backgroundColor: '#fff' }]}>
    <View style={[s.statIconWrap, { backgroundColor: iconBg }]}>
      {icon}
    </View>
    <View style={s.statTextWrap}>
      <Text style={s.statVal}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  </View>
);

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fcfcfd' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 24,
    paddingTop: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  welcome: { fontSize: 13, color: '#94a3b8', fontFamily: 'Prompt_500Medium' },
  userName: { fontSize: 22, fontFamily: 'Prompt_700Bold', color: '#0f172a' },
  logoutBtn: { padding: 10, borderRadius: 14, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#f1f5f9' },
  section: { paddingHorizontal: 20, marginTop: 28 },
  secHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  secTitle: { fontSize: 17, fontFamily: 'Prompt_700Bold', color: '#0f172a', marginBottom: 14 },
  seeAll: { fontSize: 13, color: '#dc2626', fontFamily: 'Prompt_600SemiBold' },
  actionRow: { flexDirection: 'row', gap: 14 },
  actionBtn: { 
    flex: 1, height: 110, borderRadius: 28, 
    justifyContent: 'center', alignItems: 'center', gap: 10,
    shadowColor: '#111827', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: 8
  },
  actionTxt: { color: '#fff', fontSize: 15, fontFamily: 'Prompt_700Bold' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  statCard: { 
    width: '48%', padding: 16, borderRadius: 24,
    borderWidth: 1, borderColor: '#f1f5f9',
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 2,
    marginBottom: 4
  },
  statIconWrap: {
    width: 44, height: 44, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center'
  },
  statTextWrap: { flex: 1 },
  statVal: { fontSize: 18, fontFamily: 'Prompt_700Bold', color: '#0f172a' },
  statLabel: { fontSize: 11, color: '#64748b', fontFamily: 'Prompt_500Medium', marginTop: -2 },
  listCard: { 
    backgroundColor: '#fff', borderRadius: 28, 
    borderWidth: 1, borderColor: '#f1f5f9',
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2
  },
  listItem: { 
    flexDirection: 'row', alignItems: 'center', padding: 18, 
    borderBottomWidth: 1, borderBottomColor: '#f8fafc' 
  },
  lastItem: { borderBottomWidth: 0 },
  leadThumb: { 
    width: 48, height: 48, borderRadius: 16, 
    backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#f1f5f9'
  },
  leadInitial: { fontSize: 18, color: '#334155', fontFamily: 'Prompt_700Bold' },
  leadInfo: { flex: 1, marginLeft: 14 },
  leadName: { fontSize: 15, fontFamily: 'Prompt_600SemiBold', color: '#0f172a' },
  leadTime: { fontSize: 12, color: '#94a3b8', marginTop: 2, fontFamily: 'Prompt_500Medium' },
  propInfo: { flex: 1 },
  propTitle: { fontSize: 15, fontFamily: 'Prompt_600SemiBold', color: '#0f172a' },
  propLoc: { fontSize: 12, color: '#94a3b8', marginTop: 2, fontFamily: 'Prompt_500Medium' },
  viewCount: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f8fafc', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: '#f1f5f9' },
  viewVal: { fontSize: 14, fontFamily: 'Prompt_700Bold', color: '#334155' }
});
