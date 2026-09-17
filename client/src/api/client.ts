import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

// Types
export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
  image_url: string;
  long_description: string;
  bullet_points: string; // JSON string array
  who_it_helps: string;
  coming_soon: number; // 0 or 1
  slug: string;
}

export interface TeamMember {
  id: number;
  name: string;
  title: string;
  bio: string;
  image_url: string;
  sort_order: number;
  coming_soon: number;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
}

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  sort_order: number;
}

export type SiteContent = Record<string, string>;

// API functions
export const fetchContent = () => api.get<SiteContent>('/content').then(r => r.data);
export const fetchServices = () => api.get<Service[]>('/services').then(r => r.data);
export const fetchService = (id: string | number) => api.get<Service>(`/services/${id}`).then(r => r.data);
export const fetchTeam = () => api.get<TeamMember[]>('/team').then(r => r.data);
export const fetchFaqs = () => api.get<FAQ[]>('/faqs').then(r => r.data);
export const fetchTestimonials = () => api.get<Testimonial[]>('/testimonials').then(r => r.data);
