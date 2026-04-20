const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const API_PROPERTY = `${BASE_URL}/api/property`;
export const API_ACCOUNTS = `${BASE_URL}/api/accounts`;

export default BASE_URL;
