import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getBlogs = async (params = {}) => {
  const response = await api.get('/blogs', { params });
  return response.data;
};

export const createBlog = async (blogData: any) => {
  const response = await api.post('/blogs', blogData);
  return response.data;
};

export const deleteBlog = async (id: number | string) => {
  const response = await api.delete(`/blogs/${id}`);
  return response.data;
};

export const login = async (credentials: any) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const getAds = async (params = {}) => {
  const response = await api.get('/ads', { params });
  return response.data;
};

export const createAd = async (adData: any) => {
  const response = await api.post('/ads', adData);
  return response.data;
};

export const updateAd = async (id: number, adData: any) => {
  const response = await api.put(`/ads/${id}`, adData);
  return response.data;
};

export const deleteAd = async (id: number) => {
  const response = await api.delete(`/ads/${id}`);
  return response.data;
};

export const getAdsConfig = async () => {
  const response = await api.get('/ads/config');
  return response.data;
};

export const saveAdsConfig = async (configData: any) => {
  const response = await api.post('/ads/config', configData);
  return response.data;
};

export const getAdsStats = async () => {
  const response = await api.get('/ads/stats');
  return response.data;
};

export const trackAdEvent = async (adId: number | string | null, type: 'click' | 'impression', placement?: string) => {
  const response = await api.post('/ads/track', { id: adId, type, placement });
  return response.data;
};

export const getBlogBySlug = async (slug: string) => {
  const response = await api.get(`/blogs/${slug}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const getCategory = async (slug: string) => {
  const response = await api.get(`/categories/${slug}`);
  return response.data;
};

// --- Enterprise Analytics & Live Tracking APIs ---

export const getAnalyticsOverview = async () => {
  const response = await api.get('/analytics/overview');
  return response.data;
};

export const getAnalyticsBlogs = async () => {
  const response = await api.get('/analytics/blogs');
  return response.data;
};

export const getAnalyticsAds = async () => {
  const response = await api.get('/analytics/ads');
  return response.data;
};

export const getAnalyticsVideos = async () => {
  const response = await api.get('/analytics/videos');
  return response.data;
};

export const getAnalyticsRevenue = async () => {
  const response = await api.get('/analytics/revenue');
  return response.data;
};

export const getAdminProfile = async () => {
  const response = await api.get('/admin/profile');
  return response.data;
};

export const updateAdminProfile = async (profileData: { name?: string; avatar?: string }) => {
  const response = await api.post('/admin/profile', profileData);
  return response.data;
};

export const getSiteConfig = async () => {
  const response = await api.get('/site-config');
  return response.data;
};

export const updateSiteConfig = async (configData: {
  siteName?: string;
  motto?: string;
  footer?: string;
  contactEmail?: string;
  telegram?: string;
  instagram?: string;
  youtube?: string;
  facebook?: string;
  twitter?: string;
  siteLogo?: string;
}) => {
  const response = await api.post('/site-config', configData);
  return response.data;
};

export default api;
