export async function retry<T>({
  fn,
  maxAttempts,
  baseDelay,
  maxDelay,
}: {
  fn: () => Promise<T>;
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
}): Promise<T | string[]> {
  let attempts = 0;
  let log: any = [];
  while (attempts < maxAttempts) {
    try {
      attempts++;
      console.log(`Attempt: ${attempts}`);
      const result = await fn();
      return result;
    } catch (err: any) {
      log.push(err);
      if (attempts == maxAttempts) break;
      await sleep(baseDelay, attempts, maxDelay);
    }
  }
  console.log(`Max attempts failed. Total times attempted: ${attempts}`);
  return log;
}

const sleep = (baseDelay: number, attempts: number, maxDelay: number) => {
  return new Promise((resolve) =>
    setTimeout(
      resolve,
      Math.random() * Math.min(maxDelay, baseDelay * 2 ** (attempts - 1)),
    ),
  );
};

const response1 = await retry({
  fn: () =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject("Hola");
      }, 0);
    }),
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 10000,
});

console.log(`Response: ${response1}`);
