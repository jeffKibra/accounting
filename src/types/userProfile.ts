import { User } from "firebase/auth";

export interface UserProfile extends User {
  name?: string;
  email_verified?: string;
  user_id?: string;
}
