import { Timestamp } from "firebase/firestore";

export default function dateFromTimestamp(timestamp: Timestamp) {
  return new Date(timestamp.seconds * 1000);
}
