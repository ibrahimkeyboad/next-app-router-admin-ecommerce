declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      NEXT_PUBLIC_CLOUD_UPDATE_PRESET: string;
      NEXT_PUBLIC_CLOUD_NAME: string;
      NEXT_PUBLIC_CLOUD_API: string;
      SENDGRID_API_KEY: string;
      TWILIO_AUTH_TOKEN: string;
      JWT_SECRET: string;
      NODE_ENV: 'development' | 'production';
    }
  }
}
export {};
