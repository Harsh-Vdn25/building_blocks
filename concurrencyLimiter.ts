export class concurrencyLimiter {
  private limit: number;
  private queue: {
    fn: () => Promise<any>;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }[];
  private active: number;

  constructor(limit: number) {
    this.limit = limit;
    this.queue = [];
    this.active = 0;
  }

  startTasks() {
    while (this.active < this.limit && this.queue.length > 0) {
      const { fn, resolve, reject } = this.queue.shift()!;

      this.active++;

      fn()
        .then(resolve)
        .catch(reject)
        .finally(() => {
          this.active--;
          this.startTasks();
        });
    }
  }

  run(fn: () => Promise<any>) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.startTasks();
    });
  }
}

const cLimiter = new concurrencyLimiter(3);

