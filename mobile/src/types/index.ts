export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area?: number;
  type: string;
  status: string;
  images: string; // JSON string
  features: string; // JSON string
  lat?: number;
  lng?: number;
  isFeatured: boolean;
  viewCount: number;
  createdAt: string;
  googleMapsUrl?: string;
  youtubeUrl?: string;
  furniture?: string;
  appliances?: string;
  airconCount?: number;
  waterHeaterCount?: number;
  parkingCount?: number;
  petsAllowed?: number;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image?: string;
  published: boolean;
  createdAt: string;
}

export type RootStackParamList = {
  Home: undefined;
  PropertyList: { 
    filter?: string;
    q?: string;
    status?: string;
    type?: string;
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    bedrooms?: string;
  };
  PropertyDetail: { id: string };
  Nearby: undefined;
  Login: undefined;
  AgentDashboard: undefined;
  PropertyUpload: { propertyId?: string, fresh?: boolean, resetKey?: number }; // Optional ID for editing
  LeadManagement: undefined;
};
