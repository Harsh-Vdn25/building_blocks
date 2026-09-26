type State = "CLOSED" | "OPEN" | "HALF-OPEN";

export class circuitBreaker<T> {
  state: State;
  waitTime: number;
  waitTimer: ReturnType<typeof setTimeout> | null = null;
  failureLimit: number;
  failureCount: number;
  testing: boolean;
  constructor(time: number, failures: number) {
    this.waitTime = time;
    this.state = "CLOSED"; //start with closed state
    this.failureLimit = failures;
    this.failureCount = 0;
    this.testing = false;
  }

  private startTimer() {
    this.waitTimer = setTimeout(() => {
      this.waitTimer = null;
      this.state = "HALF-OPEN";
    }, this.waitTime);
  }

  private async test(fn: () => Promise<T>) {
    if (this.testing) return;
    this.testing = true;
    try {
      const res = await fn();
      this.state = "CLOSED";
      this.failureCount = 0;
      
      return res;
    } catch (err: any) {
      this.state = "OPEN";
      this.startTimer();

      console.error(err);
    } finally {
      this.testing = false;
    }
  }

  async process(fn: () => Promise<T>) {
    if (this.state === "OPEN") {
      console.error("The circuit is open");
      return ;
    } else if (this.state === "HALF-OPEN") {
      return this.test(fn);
    } else {
      try {
        const res = await fn();
        this.failureCount = 0;

        return res;
      } catch (err: any) {
        this.failureCount++;

        if (this.failureCount >= this.failureLimit) {
          this.state = "OPEN";
          this.startTimer();
        }

        console.error(err);
      }
    }
  }
}

const cb = new circuitBreaker(200, 3);

await cb.process(
  () =>
    new Promise((res, reject) =>
      setTimeout(() => {
        reject("Rejected");
      }, 500),
    ),
);
await cb.process(
  () =>
    new Promise((res, reject) =>
      setTimeout(() => {
        reject("Rejected");
      }, 500),
    ),
);
await cb.process(
  () =>
    new Promise((res, reject) =>
      setTimeout(() => {
        reject("Rejected");
      }, 500),
    ),
);

setTimeout(async () => {
  const res = await cb.process(
    () =>
      new Promise((resolve) =>
        setTimeout(() => {
          resolve("accepted");
        }, 500),
      ),
  );

  console.log("Result:", res);
}, 190);
