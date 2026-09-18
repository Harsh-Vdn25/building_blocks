import { QueueLL } from "./QueueLL";

//sliding window rate limiter
export class SlidingWindow {
  private maxLimit: number;
  userReq: Map<number, QueueLL<number>>;
  private cleanUpTimer: any = null;

  constructor(reqLimit: number) {
    this.maxLimit = reqLimit;
    this.userReq = new Map();
    this.cleanUp();
  }

  allow(id: number): boolean {
    const requests = this.userReq.get(id);
    const time = Date.now();
    if (!requests) {
      this.userReq.set(id, new QueueLL<number>(this.maxLimit));
      this.userReq.get(id)?.enqueue(time);
      return true;
    }

    while (requests.size() > 0 && time - requests.top()! > 60_000) {
      requests.dequeue();
    }
    this.userReq.set(id, requests);
    if (requests.size() < this.maxLimit) {
      requests.enqueue(time);
      this.userReq.set(id, requests);
      return true;
    } else {
      return false;
    }
  }
  private cleanUp() {
    const tick = () => {
      try {
        for (const [id, requests] of this.userReq.entries()) {
          while (
            requests.size() > 0 &&
            Date.now() - requests.top()! >= 60_000
          ) {
            requests.dequeue();
          }
          if (requests.size() == 0) {
            this.userReq.delete(id);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        this.cleanUpTimer = setTimeout(tick, 5_000);
      }
    };
    tick();
  }

  private stopCleanUp() {
    if (this.cleanUpTimer) {
      clearTimeout(this.cleanUpTimer);
      this.cleanUpTimer = null;
    }
  }
}
