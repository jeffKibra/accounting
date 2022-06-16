export default function dateFromTimestamp(timestamp = { seconds: 0 }) {
  return new Date(timestamp.seconds * 1000);
}
