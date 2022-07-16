import { User } from "firebase/auth";
export interface UserProfile extends User {
  email: string;
  displayName: string;
}
