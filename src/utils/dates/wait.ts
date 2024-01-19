export default function wait(ms: number = 1000) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(ms);
    }, ms);
  });
}
