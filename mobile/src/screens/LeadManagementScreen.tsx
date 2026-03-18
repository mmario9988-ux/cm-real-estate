import React, { useEffect, useState } from 'react';
// DEV_REFRESH: Local resolution force
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, RefreshControl, Alert, Linking, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../api/client';
import { 
  Phone, MessageCircle, Mail, Clock, 
  MapPin, ChevronRight, Filter, Search
} from 'lucide-react-native';
import { iconProps } from '../components/iconUtils';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  createdAt: string;
  propertyTitle?: string;
}

export default function LeadManagementScreen() {
  const [leads, setLeads] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const userData = await AsyncStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    loadLeads(user);
  };

  const loadLeads = async (currentUser?: any) => {
    console.log('LEAD_LOAD_START', { email: currentUser?.email });
    setLoading(true);
    try {
      let email = currentUser?.email;
      if (!email) {
        const userData = await AsyncStorage.getItem('user');
        const user = userData ? JSON.parse(userData) : null;
        email = user?.email;
      }

      console.log('LEAD_FETCH_START', { email });
      const res = await client.get('/inquiries', {
        headers: { 'x-admin-email': email }
      });
      console.log('LEAD_FETCH_SUCCESS', res.data.length);
      setLeads(res.data);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to load inquiries');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAction = (type: 'call' | 'whatsapp' | 'email', value: string) => {
    let url = '';
    if (type === 'call') url = `tel:${value}`;
    if (type === 'whatsapp') url = `https://wa.me/${value.replace(/\+/g, '')}`;
    if (type === 'email') url = `mailto:${value}`;

    if (url) Linking.openURL(url).catch(() => Alert.alert('Error', 'Cannot open app'));
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await client.patch(`/inquiries/${id}`, { status: newStatus });
      loadLeads();
    } catch (e) {
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const filteredLeads = filter === 'All' ? leads : leads.filter(l => l.status === filter);

  if (loading && !refreshing) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#dc2626" />
      </View>
    );
  }

  return (
    <View style={s.root}>
      <View style={s.filters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterScroll}>
          {['All', 'Pending', 'Contacted', 'Closed'].map(f => (
            <TouchableOpacity 
              key={f} 
              style={[s.fBtn, filter === f && s.fBtnActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[s.fTxt, filter === f && s.fTxtActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        style={s.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadLeads(); }} />}
      >
        <View style={s.container}>
          {filteredLeads.length === 0 ? (
            <View style={s.empty}>
              <Search {...iconProps(48, '#cbd5e1')} />
              <Text style={s.emptyTxt}>No leads found</Text>
            </View>
          ) : filteredLeads.map(lead => (
            <View key={lead.id} style={s.leadCard}>
              <View style={s.leadHead}>
                <View>
                  <Text style={s.leadName}>{lead.name}</Text>
                  <View style={s.timeRow}>
                    <Clock {...iconProps(12, '#94a3b8')} />
                    <Text style={s.leadTime}>{new Date(lead.createdAt).toLocaleDateString()}</Text>
                  </View>
                </View>
                <View style={[
                  s.statusBadge, 
                  lead.status === 'Pending' ? s.statusPending : 
                  lead.status === 'Contacted' ? s.statusContacted : 
                  s.statusClosed
                ]}>
                  <Text style={[
                    s.statusTxt, 
                    lead.status === 'Pending' ? s.statusTxtPending : 
                    lead.status === 'Contacted' ? s.statusTxtContacted : 
                    s.statusTxtClosed
                  ]}>{lead.status}</Text>
                </View>
              </View>

              <Text style={s.leadMsg} numberOfLines={3}>{lead.message}</Text>
              
              <View style={s.actions}>
                <TouchableOpacity style={s.actionItem} onPress={() => handleAction('call', lead.phone)}>
                  <View style={[s.actionIcon, { backgroundColor: '#dcfce7' }]}>
                    <Phone {...iconProps(18, '#16a34a')} />
                  </View>
                  <Text style={s.actionLabel}>Call</Text>
                </TouchableOpacity>

                <TouchableOpacity style={s.actionItem} onPress={() => handleAction('whatsapp', lead.phone)}>
                  <View style={[s.actionIcon, { backgroundColor: '#f0f9ff' }]}>
                    <MessageCircle {...iconProps(18, '#0284c7')} />
                  </View>
                  <Text style={s.actionLabel}>WhatsApp</Text>
                </TouchableOpacity>

                <TouchableOpacity style={s.actionItem} onPress={() => handleAction('email', lead.email)}>
                  <View style={[s.actionIcon, { backgroundColor: '#f5f3ff' }]}>
                    <Mail {...iconProps(18, '#7c3aed')} />
                  </View>
                  <Text style={s.actionLabel}>Email</Text>
                </TouchableOpacity>
              </View>

              <View style={s.statusToggle}>
                <Text style={s.updateLabel}>Update Status:</Text>
                <View style={s.toggleRow}>
                  {['Contacted', 'Closed'].map(st => (
                    <TouchableOpacity 
                      key={st} 
                      style={s.toggleBtn}
                      onPress={() => updateStatus(lead.id, st)}
                    >
                      <Text style={s.toggleTxt}>{st}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  filters: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  filterScroll: { paddingHorizontal: 20, paddingVertical: 12, gap: 10 },
  fBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f1f5f9' },
  fBtnActive: { backgroundColor: '#111827' },
  fTxt: { fontSize: 13, fontFamily: 'Prompt_500Medium', color: '#64748b' },
  fTxtActive: { color: '#fff' },
  scroll: { flex: 1 },
  container: { padding: 20, gap: 16 },
  empty: { padding: 60, alignItems: 'center', gap: 12 },
  emptyTxt: { fontSize: 15, fontFamily: 'Prompt_500Medium', color: '#94a3b8' },
  leadCard: { backgroundColor: '#fff', borderRadius: 24, padding: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  leadHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  leadName: { fontSize: 17, fontFamily: 'Prompt_700Bold', color: '#111827' },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  leadTime: { fontSize: 12, color: '#94a3b8', fontFamily: 'Prompt' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusPending: { backgroundColor: '#fff7ed' },
  statusContacted: { backgroundColor: '#eff6ff' },
  statusClosed: { backgroundColor: '#f0fdf4' },
  statusTxt: { fontSize: 11, fontFamily: 'Prompt_700Bold', textTransform: 'uppercase' },
  statusTxtPending: { color: '#c2410c' },
  statusTxtContacted: { color: '#1d4ed8' },
  statusTxtClosed: { color: '#15803d' },
  leadMsg: { fontSize: 14, color: '#475569', lineHeight: 22, fontFamily: 'Prompt', marginBottom: 20 },
  actions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 20, gap: 20 },
  actionItem: { flex: 1, alignItems: 'center', gap: 6 },
  actionIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  actionLabel: { fontSize: 11, fontFamily: 'Prompt_600SemiBold', color: '#64748b' },
  statusToggle: { marginTop: 20, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#f8fafc' },
  updateLabel: { fontSize: 11, fontFamily: 'Prompt_700Bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 10 },
  toggleRow: { flexDirection: 'row', gap: 10 },
  toggleBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, backgroundColor: '#f8fafc', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  toggleTxt: { fontSize: 12, fontFamily: 'Prompt_600SemiBold', color: '#475569' }
});
