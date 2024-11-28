if (!import.meta.env.VITE_APP_DOMAIN) console.error("Incorrect or no config provided for application to start");

export const API_URL = import.meta.env.VITE_APP_DOMAIN;

