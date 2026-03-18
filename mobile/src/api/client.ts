import axios from 'axios';

import { Platform } from 'react-native';

// For Android Emulator: use '10.0.2.2'
// For Web/iOS Simulator: use 'localhost'
// Set your production Vercel URL here
const PROD_URL = 'https://cm-real-estate.vercel.app/api';

const getApiUrl = () => {
  // If we are in a professional/production environment (real device), use PROD_URL
  if (!__DEV__) return PROD_URL;
  
  if (Platform.OS === 'android') return 'http://10.0.2.2:3000/api';
  return 'http://localhost:3000/api';
};

const API_URL = getApiUrl();

const client = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;
