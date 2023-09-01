import { devConfig, prodConfig } from './firebase';

const isLive = process.env.REACT_APP_ENV === 'prod';
console.log({ isLive });

const firebaseConfig = isLive ? prodConfig : devConfig;

export default firebaseConfig;
