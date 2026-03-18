import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Image, ActivityIndicator, Dimensions, Linking,
  ImageBackground, Animated, StatusBar, Platform
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Property, Post, RootStackParamList } from '../types';
import {
  Search, MapPin, Star, Bed, Bath, Home as HomeIcon,
  Tag, BookOpen, ChevronRight, TrendingUp, Clock,
  Compass, Heart, ArrowRight, Menu, Filter, X
} from 'lucide-react-native';
import { View as ViewRN, TextInput, Modal, SafeAreaView } from 'react-native';
import { iconProps } from '../components/iconUtils';
import client from '../api/client';

const { width: W, height: H } = Dimensions.get('window');
const CARD_W = W * 0.75;
const SMALL_CARD_W = W * 0.42;
const ARTICLE_W = W * 0.72;

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const nav = useNavigation<Nav>();
  const [props, setProps] = useState<Property[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');

  const zones = [
    "เมืองเชียงใหม่", "นิมมาน", "หางดง", "แม่ริม", "สันทราย", 
    "แม่เหียะ", "สันกำแพง", "สารภี", "ดอยสะเก็ด", "หนองจ๊อม", "หนองหอย"
  ];

  useFocusEffect(
    React.useCallback(() => {
      load();
    }, [])
  );

  const load = async () => {
    setError(false);
    setLoading(true);
    try {
      const [p, a] = await Promise.all([
        client.get('/properties'),
        client.get('/posts?published=true'),
      ]);
      setProps(p.data);
      setPosts(a.data);
    } catch (e) { 
      console.error(e); 
      setError(true);
    }
    finally { setLoading(false); }
  };

  const handleSearch = () => {
    nav.navigate('PropertyList', {
      q: searchQuery,
      status: status || undefined,
      type: type || undefined,
      location: location || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      bedrooms: bedrooms || undefined,
    });
  };

  const clearFilters = () => {
    setStatus('');
    setType('');
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('');
  };

  const featured = props.filter(p => p.isFeatured).slice(0, 6);
  const rent = props.filter(p => p.status === 'For Rent').slice(0, 8);
  const sale = props.filter(p => p.status === 'For Sale').slice(0, 8);
  const total = props.length;

  const imgs = (s: string) => { try { return JSON.parse(s || '[]') as string[]; } catch { return []; } };

  const fmt = (n: number) => n >= 1e6 ? `${(n/1e6).toFixed(1)}M` : n.toLocaleString();

  // ──────── LARGE CARD ────────
  const BigCard = ({ item }: { item: Property }) => {
    const im = imgs(item.images);
    const isRent = item.status === 'For Rent';
    return (
      <TouchableOpacity
        style={s.bigCard}
        activeOpacity={0.95}
        onPress={() => nav.navigate('PropertyDetail', { id: item.id })}
      >
        {im[0] ? <Image source={{ uri: im[0] }} style={s.bigImg} /> :
          <View style={[s.bigImg, { backgroundColor: '#e8e8e8', justifyContent: 'center', alignItems: 'center' }]}><HomeIcon {...iconProps(28, '#ccc')} /></View>}
        {/* Bottom gradient */}
        <View style={s.bigGrad} />
        {/* Status pill */}
        <View style={[s.pill, { backgroundColor: isRent ? '#3B82F6' : '#10B981' }]}>
          <Text style={s.pillTxt}>{isRent ? 'เช่า' : 'ขาย'}</Text>
        </View>
        {/* Featured star */}
        {item.isFeatured && (
          <View style={s.starCircle}><Star {...iconProps(12, '#FBBF24')} /></View>
        )}
        {/* Info overlay */}
        <View style={s.bigInfo}>
          <Text style={s.bigPrice}>฿{fmt(item.price)}{isRent ? '/เดือน' : ''}</Text>
          <Text style={s.bigTitle} numberOfLines={1}>{item.title}</Text>
          <View style={s.bigLoc}>
            <MapPin {...iconProps(11, 'rgba(255,255,255,0.7)')} />
            <Text style={s.bigLocTxt} numberOfLines={1}>{item.location}</Text>
          </View>
        </View>
        {/* Stats bar */}
        <View style={s.bigStats}>
          <View style={s.bigStat}><Bed {...iconProps(13, '#666')} /><Text style={s.bigStatTxt}>{item.bedrooms}</Text></View>
          <View style={s.bigStat}><Bath {...iconProps(13, '#666')} /><Text style={s.bigStatTxt}>{item.bathrooms}</Text></View>
          {item.area ? <Text style={s.bigStatArea}>{item.area} ตร.ม.</Text> : null}
        </View>
      </TouchableOpacity>
    );
  };

  // ──────── SMALL CARD ────────
  const SmallCard = ({ item }: { item: Property }) => {
    const im = imgs(item.images);
    const isRent = item.status === 'For Rent';
    return (
      <TouchableOpacity
        style={s.smCard}
        activeOpacity={0.95}
        onPress={() => nav.navigate('PropertyDetail', { id: item.id })}
      >
        {im[0] ? <Image source={{ uri: im[0] }} style={s.smImg} /> :
          <View style={[s.smImg, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}><HomeIcon {...iconProps(22, '#ddd')} /></View>}
        <View style={[s.smPill, { backgroundColor: isRent ? '#3B82F6' : '#10B981' }]}>
          <Text style={s.pillTxt}>{isRent ? 'เช่า' : 'ขาย'}</Text>
        </View>
        <View style={s.smBody}>
          <Text style={s.smPrice}>฿{fmt(item.price)}</Text>
          <Text style={s.smTitle} numberOfLines={1}>{item.title}</Text>
          <View style={s.smLoc}>
            <MapPin {...iconProps(10, '#aaa')} />
            <Text style={s.smLocTxt} numberOfLines={1}>{item.location}</Text>
          </View>
          <View style={s.smStats}>
            <Bed {...iconProps(11, '#999')} /><Text style={s.smStatTxt}>{item.bedrooms}</Text>
            <Bath {...iconProps(11, '#999')} /><Text style={s.smStatTxt}>{item.bathrooms}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // ──────── HEADER ────────
  const SectionHead = ({ title, accent, count, onSeeAll }: {
    title: string; accent: string; count?: number; onSeeAll?: () => void;
  }) => (
    <View style={s.secHead}>
      <View style={s.secLeft}>
        <View style={[s.secBar, { backgroundColor: accent }]} />
        <Text style={s.secTitle}>{title}</Text>
        {count !== undefined && <View style={s.secBadge}><Text style={s.secBadgeTxt}>{count}</Text></View>}
      </View>
      {onSeeAll && (
        <TouchableOpacity style={s.seeAllBtn} onPress={onSeeAll}>
          <Text style={[s.seeAllTxt, { color: accent }]}>ดูทั้งหมด</Text>
          <ChevronRight {...iconProps(14, accent)} />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        {/* ════════ HERO ════════ */}
        <ImageBackground
          source={require('../../assets/images/hero-bg.png')}
          style={s.hero}
          resizeMode="cover"
        >
          <View style={s.heroOver} />

          {/* Menu Button */}
          <TouchableOpacity 
            style={s.menuBtn} 
            onPress={() => (nav as any).openDrawer()}
          >
            <Menu {...iconProps(26, '#fff')} />
          </TouchableOpacity>

          <View style={s.heroInner}>
            <Text style={s.heroBrand}>CHIANG MAI ESTATES</Text>
            <View style={{ marginBottom: 15 }}>
              <View style={{ position: 'relative' }}>
                {/* 4 Background layers for sharp 1.5px outline */}
                {[
                  { t: -1.5, l: -1.5 },
                  { t: -1.5, l: 1.5 },
                  { t: 1.5, l: -1.5 },
                  { t: 1.5, l: 1.5 },
                ].map((pos, i) => (
                  <View key={i} style={{ position: 'absolute', top: pos.t, left: pos.l, flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
                    <Text style={[s.heroH1, { color: '#fff' }]}>บ้านเช่า </Text>
                    <Text style={[s.heroH1, { color: '#fff' }]}>เชียงใหม่</Text>
                  </View>
                ))}
                
                {/* Main colored text */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  <Text style={[s.heroH1, { color: '#dc2626' }]}>บ้านเช่า </Text>
                  <Text style={[s.heroH1, { color: '#38BDF8' }]}>เชียงใหม่</Text>
                </View>
              </View>
            </View>
            <Text style={s.heroP}>แอพบ้านเช่าอันดับ 1 ของเชียงใหม่</Text>

            {/* Glass search */}
            <View style={s.glassSearch}>
              <View style={s.glassIcon}>
                <Search {...iconProps(18, 'rgba(255,255,255,0.7)')} />
              </View>
              <TextInput
                style={s.glassInput}
                placeholder="ค้นหาบ้าน, คอนโด, ทาวน์โฮม..."
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity 
                style={s.glassFilter}
                onPress={() => setShowFilters(true)}
              >
                <Filter {...iconProps(18, (status || type || location || minPrice || maxPrice || bedrooms) ? '#38BDF8' : '#fff')} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={s.glassBtn}
                onPress={handleSearch}
              >
                <ArrowRight {...iconProps(18, '#fff')} />
              </TouchableOpacity>
            </View>
          </View>

        </ImageBackground>

        {/* Filters Modal */}
        <Modal visible={showFilters} animationType="slide" transparent>
          <View style={s.modalOverlay}>
            <View style={s.modalContent}>
              <View style={s.modalHeader}>
                <Text style={s.modalTitle}>ตัวกรองขั้นสูง</Text>
                <TouchableOpacity onPress={() => setShowFilters(false)} style={s.modalClose}>
                  <X {...iconProps(24, '#111827')} />
                </TouchableOpacity>
              </View>

              <ScrollView style={s.modalBody} showsVerticalScrollIndicator={false}>
                <Text style={s.fLabel}>สถานะ</Text>
                <View style={s.segWrap}>
                  {['', 'For Rent', 'For Sale'].map(v => (
                    <TouchableOpacity key={v} style={[s.seg, status === v && s.segActive]} onPress={() => setStatus(v)}>
                      <Text style={[s.segTxt, status === v && s.segTxtActive]}>
                        {v === '' ? 'ทั้งหมด' : v === 'For Rent' ? 'เช่า' : 'ขาย'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={s.fLabel}>ทำเล / โซน</Text>
                <View style={s.tagWrap}>
                  <TouchableOpacity style={[s.tag, location === '' && s.tagActive]} onPress={() => setLocation('')}>
                    <Text style={[s.tagTxt, location === '' && s.tagTxtActive]}>ทุกทำเล</Text>
                  </TouchableOpacity>
                  {zones.map(z => (
                    <TouchableOpacity key={z} style={[s.tag, location === z && s.tagActive]} onPress={() => setLocation(z)}>
                      <Text style={[s.tagTxt, location === z && s.tagTxtActive]}>{z}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={s.fLabel}>ประเภททรัพย์สิน</Text>
                <View style={s.tagWrap}>
                  {['', 'House', 'Condo', 'Townhouse', 'Land'].map(v => (
                    <TouchableOpacity key={v} style={[s.tag, type === v && s.tagActive]} onPress={() => setType(v)}>
                      <Text style={[s.tagTxt, type === v && s.tagTxtActive]}>
                        {v === '' ? 'ทั้งหมด' : v === 'House' ? 'บ้าน' : v === 'Condo' ? 'คอนโด' : v === 'Townhouse' ? 'ทาวน์โฮม' : 'ที่ดิน'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={s.fLabel}>ช่วงราคา (บาท)</Text>
                <View style={s.inputRow}>
                  <TextInput style={s.fInput} placeholder="ขั้นต่ำ" keyboardType="numeric" value={minPrice} onChangeText={setMinPrice} />
                  <Text style={s.inputSep}>-</Text>
                  <TextInput style={s.fInput} placeholder="สูงสุด" keyboardType="numeric" value={maxPrice} onChangeText={setMaxPrice} />
                </View>

                <Text style={s.fLabel}>จำนวนห้องนอน</Text>
                <View style={s.tagWrap}>
                  {['', '1', '2', '3', '4', '5'].map(v => (
                    <TouchableOpacity key={v} style={[s.tag, bedrooms === v && s.tagActive]} onPress={() => setBedrooms(v)}>
                      <Text style={[s.tagTxt, bedrooms === v && s.tagTxtActive]}>{v === '' ? 'ไม่ระบุ' : `${v}+ ห้อง`}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={{ height: 40 }} />
              </ScrollView>

              <View style={s.modalFooter}>
                <TouchableOpacity style={s.fClear} onPress={clearFilters}><Text style={s.fClearTxt}>ล้างค่า</Text></TouchableOpacity>
                <TouchableOpacity style={s.fApply} onPress={() => { setShowFilters(false); handleSearch(); }}>
                  <Text style={s.fApplyTxt}>แสดงผลลัพธ์</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {loading ? (
          <View style={s.loadBox}>
            <ActivityIndicator size="large" color="#950000" />
            <Text style={s.loadTxt}>กำลังโหลด...</Text>
          </View>
        ) : error ? (
          <View style={s.loadBox}>
            <Text style={[s.loadTxt, { color: '#dc2626' }]}>ไม่สามารถเชื่อมต่อ Server ได้</Text>
            <TouchableOpacity style={s.retryBtn} onPress={load}>
              <Text style={s.retryTxt}>ลองใหม่อีกครั้ง</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={s.content}>
            {/* ──── FEATURED ──── */}
            {featured.length > 0 && (
              <View style={s.sec}>
                <SectionHead title="แนะนำพิเศษ" accent="#b91c1c" count={featured.length}
                  onSeeAll={() => nav.navigate('PropertyList', {})} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                  contentContainerStyle={s.hScroll} decelerationRate="fast" snapToInterval={CARD_W + 14}>
                  {featured.map(i => <BigCard key={i.id} item={i} />)}
                </ScrollView>
              </View>
            )}

            {/* ──── RENT ──── */}
            {rent.length > 0 && (
              <View style={s.sec}>
                <SectionHead title="บ้านเช่า" accent="#3B82F6" count={rent.length}
                  onSeeAll={() => nav.navigate('PropertyList', {})} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                  contentContainerStyle={s.hScroll} decelerationRate="fast" snapToInterval={SMALL_CARD_W + 12}>
                  {rent.map(i => <SmallCard key={i.id} item={i} />)}
                </ScrollView>
              </View>
            )}

            {/* ──── SALE ──── */}
            {sale.length > 0 && (
              <View style={s.sec}>
                <SectionHead title="บ้านขาย" accent="#10B981" count={sale.length}
                  onSeeAll={() => nav.navigate('PropertyList', {})} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                  contentContainerStyle={s.hScroll} decelerationRate="fast" snapToInterval={SMALL_CARD_W + 12}>
                  {sale.map(i => <SmallCard key={i.id} item={i} />)}
                </ScrollView>
              </View>
            )}

            {/* ──── ARTICLES ──── */}
            {posts.length > 0 && (
              <View style={s.sec}>
                <SectionHead title="บทความ & ข่าวสาร" accent="#F59E0B" />
                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                  contentContainerStyle={s.hScroll} decelerationRate="fast" snapToInterval={ARTICLE_W + 14}>
                  {posts.map(post => (
                    <TouchableOpacity key={post.id} style={s.artCard} activeOpacity={0.92}
                      onPress={() => Linking.openURL(`https://cm-real-estate.vercel.app/blog/${post.slug}`)}>
                      {post.image ?
                        <Image source={{ uri: post.image }} style={s.artImg} /> :
                        <View style={[s.artImg, { backgroundColor: '#FEF3C7', justifyContent: 'center', alignItems: 'center' }]}>
                          <BookOpen {...iconProps(30, '#F59E0B')} />
                        </View>}
                      <View style={s.artBody}>
                        <View style={s.artMeta}>
                          <Clock {...iconProps(10, '#aaa')} />
                          <Text style={s.artDate}>{new Date(post.createdAt).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })}</Text>
                        </View>
                        <Text style={s.artTitle} numberOfLines={2}>{post.title}</Text>
                        {post.excerpt && <Text style={s.artDesc} numberOfLines={2}>{post.excerpt}</Text>}
                        <Text style={s.artRead}>อ่านเพิ่ม →</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Footer */}
            <View style={s.footer}>
              <Text style={s.footTxt}>© 2026 Chiang Mai Estates</Text>
            </View>
          </View>
        )}
      </Animated.ScrollView>
    </View>
  );
}

// ══════════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════════
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0F0F14' },

  // ─── HERO ───
  hero: { width: W, height: H * 0.55, justifyContent: 'center', paddingTop: 40 },
  heroOver: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  menuBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 5,
  },
  heroInner: { paddingHorizontal: 20, marginTop: 20 },
  heroBrand: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D4AF37',
    letterSpacing: 4,
    marginBottom: 12,
    fontFamily: 'Prompt_700Bold',
  },
  heroH1: {
    fontSize: 38,
    fontFamily: 'Prompt_900Black',
    lineHeight: 48,
    marginRight: 8,
  },
  heroP: { 
    fontSize: 15, 
    color: '#fff', 
    marginBottom: 25, 
    fontFamily: 'Prompt_500Medium',
    opacity: 0.9 
  },

  // Glass search
  glassSearch: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 24,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    marginTop: 5,
  },
  glassIcon: { marginRight: 10 },
  glassInput: { flex: 1, height: '100%', color: '#fff', fontSize: 15, fontFamily: 'Prompt' },
  glassFilter: { padding: 10 },
  glassBtn: {
    width: 44, height: 44, borderRadius: 16,
    backgroundColor: '#dc2626',
    justifyContent: 'center', alignItems: 'center',
    marginLeft: 5,
  },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { 
    backgroundColor: '#fff', 
    height: H * 0.85, 
    borderTopLeftRadius: 32, 
    borderTopRightRadius: 32,
    paddingTop: 20
  },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 24,
    marginBottom: 20
  },
  modalTitle: { fontSize: 20, fontFamily: 'Prompt_700Bold', color: '#111827' },
  modalClose: { padding: 4 },
  modalBody: { flex: 1, paddingHorizontal: 24 },
  fLabel: { fontSize: 14, fontFamily: 'Prompt_600SemiBold', color: '#111827', marginTop: 15, marginBottom: 12 },
  segWrap: { flexDirection: 'row', backgroundColor: '#f5f7f9', padding: 4, borderRadius: 14, marginBottom: 10 },
  seg: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  segActive: { backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
  segTxt: { fontSize: 13, fontFamily: 'Prompt_500Medium', color: '#94a3b8' },
  segTxtActive: { color: '#dc2626' },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tag: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: '#f5f7f9', borderWidth: 1, borderColor: '#e2e8f0' },
  tagActive: { backgroundColor: '#fff', borderColor: '#dc2626' },
  tagTxt: { fontSize: 13, fontFamily: 'Prompt_500Medium', color: '#64748b' },
  tagTxtActive: { color: '#dc2626' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  fInput: { flex: 1, backgroundColor: '#f5f7f9', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, fontFamily: 'Prompt' },
  inputSep: { color: '#94a3b8', fontWeight: 'bold' },
  modalFooter: { 
    padding: 24, 
    borderTopWidth: 1, 
    borderTopColor: '#f1f5f9', 
    flexDirection: 'row', 
    gap: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24
  },
  fClear: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 16 },
  fClearTxt: { fontSize: 15, fontFamily: 'Prompt_600SemiBold', color: '#64748b' },
  fApply: { 
    flex: 2, 
    backgroundColor: '#111827', 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingVertical: 16,
    elevation: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8
  },
  fApplyTxt: { fontSize: 15, fontFamily: 'Prompt_600SemiBold', color: '#fff' },



  // Loading
  loadBox: { height: 200, justifyContent: 'center', alignItems: 'center' },
  loadTxt: { marginTop: 10, color: '#666', fontFamily: 'Prompt' },

  // Content
  content: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 24,
    minHeight: H * 0.5,
  },

  // Section
  sec: { marginBottom: 24 },
  secHead: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 18, marginBottom: 14,
  },
  secLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  secBar: { width: 3, height: 18, borderRadius: 2 },
  secTitle: { fontSize: 17, fontWeight: '800', color: '#111827', fontFamily: 'Prompt' },
  secBadge: {
    backgroundColor: '#E8E8EE', borderRadius: 10,
    paddingHorizontal: 7, paddingVertical: 1,
  },
  secBadgeTxt: { fontSize: 11, fontWeight: '700', color: '#888' },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllTxt: { fontSize: 12, fontWeight: '600', fontFamily: 'Prompt' },

  hScroll: { paddingLeft: 18, paddingRight: 6 },

  // ─── BIG CARD ───
  bigCard: {
    width: CARD_W, marginRight: 14, borderRadius: 20,
    backgroundColor: '#fff', overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 15, elevation: 4,
  },
  bigImg: { width: '100%', height: 190, resizeMode: 'cover' },
  bigGrad: {
    position: 'absolute', bottom: 65, left: 0, right: 0, height: 100,
    backgroundColor: 'transparent',
  },
  pill: {
    position: 'absolute', top: 12, right: 12,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
  },
  pillTxt: { fontSize: 11, fontWeight: '700', color: '#fff', fontFamily: 'Prompt' },
  starCircle: {
    position: 'absolute', top: 12, left: 12,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center', alignItems: 'center',
  },
  bigInfo: {
    position: 'absolute', bottom: 56, left: 0, right: 0,
    paddingHorizontal: 14, paddingBottom: 8,
  },
  bigPrice: { fontSize: 18, fontWeight: '900', color: '#fff', fontFamily: 'Prompt', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  bigTitle: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.9)', marginTop: 2, fontFamily: 'Prompt', textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  bigLoc: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 },
  bigLocTxt: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily: 'Prompt' },
  bigStats: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 14, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: '#f0f0f0',
  },
  bigStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  bigStatTxt: { fontSize: 12, color: '#666', fontWeight: '500', fontFamily: 'Prompt' },
  bigStatArea: { fontSize: 11, color: '#999', marginLeft: 'auto', fontFamily: 'Prompt' },

  // ─── SMALL CARD ───
  smCard: {
    width: SMALL_CARD_W, marginRight: 12, borderRadius: 16,
    backgroundColor: '#fff', overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  smImg: { width: '100%', height: 110, resizeMode: 'cover' },
  smPill: {
    position: 'absolute', top: 8, right: 8,
    paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6,
  },
  smBody: { padding: 10 },
  smPrice: { fontSize: 14, fontFamily: 'Prompt_700Bold', color: '#dc2626', marginBottom: 2 },
  smTitle: { fontSize: 12, fontFamily: 'Prompt_600SemiBold', color: '#111827', marginBottom: 3 },
  smLoc: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 5 },
  smLocTxt: { fontSize: 10, color: '#aaa', flex: 1, fontFamily: 'Prompt' },
  smStats: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  smStatTxt: { fontSize: 10, color: '#999', marginRight: 6, fontFamily: 'Prompt' },

  // ─── ARTICLE CARD ───
  artCard: {
    width: ARTICLE_W, marginRight: 14, borderRadius: 18,
    backgroundColor: '#fff', overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  artImg: { width: '100%', height: 120, resizeMode: 'cover' },
  artBody: { padding: 12 },
  artMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 5 },
  artDate: { fontSize: 10, color: '#aaa' },
  artTitle: { fontSize: 14, fontWeight: '700', color: '#111827', lineHeight: 20, marginBottom: 4, fontFamily: 'Prompt' },
  artDesc: { fontSize: 11, color: '#888', lineHeight: 16, marginBottom: 6, fontFamily: 'Prompt' },
  artRead: { fontSize: 11, fontWeight: '700', color: '#dc2626', fontFamily: 'Prompt' },

  // Footer
  footer: { alignItems: 'center', paddingVertical: 28, marginBottom: 20 },
  footTxt: { fontSize: 11, color: '#ccc' },
  retryBtn: { marginTop: 15, backgroundColor: '#111827', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  retryTxt: { color: '#fff', fontFamily: 'Prompt_600SemiBold', fontSize: 14 }
});
