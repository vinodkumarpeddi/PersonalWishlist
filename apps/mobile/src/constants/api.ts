import Constants from 'expo-constants';

const DEV_API_URL = 'http://localhost:3001';

export const API_BASE_URL =
  Constants.expoConfig?.extra?.apiUrl || DEV_API_URL;

export const API_V1 = `${API_BASE_URL}/api/v1`;
