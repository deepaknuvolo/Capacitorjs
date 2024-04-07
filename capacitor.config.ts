import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.capacitorjs',
  appName: 'capacitorjs',
  webDir: 'dist',
  bundledWebRuntime: true,
  server: {
    androidScheme: 'https'
  }
};

export default config;
