import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { RootStackParamList } from '../types';
import HomeScreen from '../screens/HomeScreen';
import PropertyListScreen from '../screens/PropertyListScreen';
import NearbyScreen from '../screens/NearbyScreen';
import PropertyDetailScreen from '../screens/PropertyDetailScreen';
import LoginScreen from '../screens/LoginScreen';
import AgentDashboardScreen from '../screens/AgentDashboardScreen';
import PropertyUploadScreen from '../screens/PropertyUploadScreen';
import LeadManagementScreen from '../screens/LeadManagementScreen';
import { Home, List, MapPin, Info, Phone, Menu, LayoutDashboard, LogIn } from 'lucide-react-native';
import { iconProps } from '../components/iconUtils';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

const MenuBtn = () => {
  const nav = useNavigation<DrawerNavigationProp<any>>();
  return (
    <TouchableOpacity onPress={() => nav.openDrawer()} style={{ marginRight: 15 }}>
      <Menu {...iconProps(24, '#111827')} />
    </TouchableOpacity>
  );
};

const MainStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen 
        name="PropertyList" 
        component={PropertyListScreen} 
        options={{ 
          headerShown: true, 
          title: 'รายการทรัพย์สิน', 
          headerTitleStyle: { fontFamily: 'Prompt_600SemiBold' },
          headerRight: () => <MenuBtn />
        }}
      />
      <Stack.Screen 
        name="PropertyDetail" 
        component={PropertyDetailScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Nearby" 
        component={NearbyScreen} 
        options={{ 
          headerShown: true, 
          title: 'รอบตัวฉัน', 
          headerTitleStyle: { fontFamily: 'Prompt_600SemiBold' },
          headerRight: () => <MenuBtn />
        }}
      />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: true, title: 'เข้าสู่ระบบ', headerTitleStyle: { fontFamily: 'Prompt_600SemiBold' } }} />
      <Stack.Screen name="AgentDashboard" component={AgentDashboardScreen} options={{ headerShown: true, title: 'Agent Console', headerTitleStyle: { fontFamily: 'Prompt_600SemiBold' }, headerRight: () => <MenuBtn /> }} />
      <Stack.Screen name="PropertyUpload" component={PropertyUploadScreen} options={{ headerShown: true, title: 'ลงประกาศใหม่', headerTitleStyle: { fontFamily: 'Prompt_600SemiBold' } }} />
      <Stack.Screen name="LeadManagement" component={LeadManagementScreen} options={{ headerShown: true, title: 'จัดการลูกค้า', headerTitleStyle: { fontFamily: 'Prompt_600SemiBold' } }} />
    </Stack.Navigator>
  );
};

const CustomDrawerContent = (props: any) => {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
      <View style={s.drawerHeader}>
        <Image 
          source={require('../../assets/images/hero-bg.png')} 
          style={s.drawerCover} 
        />
        <View style={s.drawerOverlay} />
        <TouchableOpacity 
          style={s.drawerBrandSection}
          onPress={() => props.navigation.navigate('Main', { screen: 'Home' })}
        >
          <Text style={s.drawerBrand}>CHIANG MAI ESTATES</Text>
          <Text style={s.drawerSubtitle}>แอพบ้านเช่าอันดับ 1 ของเชียงใหม่</Text>
        </TouchableOpacity>
      </View>
      <DrawerItem
        label="หน้าหลัก"
        labelStyle={s.drawerLabel}
        style={s.drawerItem}
        icon={({ focused }) => <Home {...iconProps(22, focused ? '#dc2626' : '#64748b')} />}
        onPress={() => props.navigation.navigate('Main', { screen: 'Home' })}
      />
      <DrawerItem
        label="ทรัพย์สินทั้งหมด"
        labelStyle={s.drawerLabel}
        style={s.drawerItem}
        icon={({ focused }) => <List {...iconProps(22, focused ? '#dc2626' : '#64748b')} />}
        onPress={() => props.navigation.navigate('Main', { screen: 'PropertyList' })}
      />
      <DrawerItem
        label="รอบตัวฉัน"
        labelStyle={s.drawerLabel}
        style={s.drawerItem}
        icon={({ focused }) => <MapPin {...iconProps(22, focused ? '#dc2626' : '#64748b')} />}
        onPress={() => props.navigation.navigate('Main', { screen: 'Nearby' })}
      />
      <View style={s.drawerDivider} />
      <DrawerItem
        label="Agent Tools"
        labelStyle={[s.drawerLabel, { color: '#dc2626' }]}
        style={s.drawerItem}
        icon={({ focused }) => <LayoutDashboard {...iconProps(22, focused ? '#dc2626' : '#dc2626')} />}
        onPress={() => props.navigation.navigate('Main', { screen: 'AgentDashboard' })}
      />
      <DrawerItem
        label="เกี่ยวกับเรา"
        labelStyle={s.drawerLabel}
        style={s.drawerItem}
        icon={({ focused }) => <Info {...iconProps(22, focused ? '#dc2626' : '#64748b')} />}
        onPress={() => Linking.openURL('https://cm-real-estate.vercel.app/about')}
      />
      <DrawerItem
        label="ติดต่อเรา"
        labelStyle={s.drawerLabel}
        style={s.drawerItem}
        icon={({ focused }) => <Phone {...iconProps(22, focused ? '#dc2626' : '#64748b')} />}
        onPress={() => Linking.openURL('https://cm-real-estate.vercel.app/contact')}
      />
    </DrawerContentScrollView>
  );
};

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: { width: 280 },
          drawerActiveTintColor: '#dc2626',
          drawerPosition: 'right',
        }}
      >
        <Drawer.Screen name="Main" component={MainStack} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const s = StyleSheet.create({
  drawerHeader: {
    height: 160,
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  drawerCover: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  drawerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  drawerBrandSection: {
    padding: 20,
  },
  drawerBrand: {
    color: '#D4AF37',
    fontSize: 14,
    fontFamily: 'Prompt_700Bold',
    letterSpacing: 2,
  },
  drawerSubtitle: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Prompt_400Regular',
    marginTop: 4,
  },
  drawerLabel: {
    fontFamily: 'Prompt_500Medium',
    fontSize: 15,
    color: '#111827',
  },
  drawerDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 15,
    marginHorizontal: 20,
  },
  drawerItem: {
    marginVertical: 2,
    borderRadius: 12,
  },
});

export default RootNavigator;
