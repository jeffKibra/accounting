import { User } from "firebase/auth";

export default function formatUserProfile(user: User) {
  const {
    displayName,
    email,
    emailVerified,
    isAnonymous,
    phoneNumber,
    photoURL,
    providerId,
    tenantId,
    uid,
    providerData,
  } = user;

  return {
    displayName,
    email,
    emailVerified,
    isAnonymous,
    phoneNumber,
    photoURL,
    providerId,
    tenantId,
    uid,
    providerData,
  };
}
