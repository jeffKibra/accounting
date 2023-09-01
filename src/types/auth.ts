import { User } from "firebase/auth";

export interface UserProfile extends User {
  email: string;
  displayName: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm extends LoginForm {
  firstName: string;
  lastName: string;
  confirmPassword: string;
}

// interface UserFromDb {
//   displayName:string;
//   email;
//   emailVerified;
//   phoneNumber;
//   photoURL;
//   providerId;
//   tenantId;
//   uid;
//   providerData;
// }
