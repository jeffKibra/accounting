const devConfig = {
  apiKey: "AIzaSyBTpBfJ8A6Byg5qaCs3pcFI60TIXmg4igw",
  authDomain: "lehi-76a0d.firebaseapp.com",
  projectId: "lehi-76a0d",
  storageBucket: "lehi-76a0d.appspot.com",
  messagingSenderId: "440448600916",
  appId: "1:440448600916:web:46de09a150e69e769716c1",
  measurementId: "G-TFED4L6D0Y",
};

const prodConfig = {
  apiKey: "AIzaSyCmk_17b8fSJlKOlQvdsj7UDlmABLoix_0",
  authDomain: "bracketaccounts.firebaseapp.com",
  projectId: "bracketaccounts",
  storageBucket: "bracketaccounts.appspot.com",
  messagingSenderId: "925236777013",
  appId: "1:925236777013:web:9d021015081ff10b8fe17c",
  measurementId: "G-MT9999CPZJ",
};

const isLive = process.env.REACT_APP_ENV === "production";
console.log({ isLive });

const firebaseConfig = isLive ? prodConfig : devConfig;

export default firebaseConfig;
