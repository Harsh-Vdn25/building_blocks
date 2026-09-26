import { PriorityQueue } from "./priorityQueue";

type resolveType = (value: any) => void;
type rejectType = (error: any) => void;
type stateType = "CLOSING" | "SHUT_DOWN" | "OPEN";

export class JobQueue {
  private tasks;
  private threshold: number;
  private active: number;
  private state: stateType;
  private shutdownResolver: resolveType | null = null;

  constructor(limit: number) {
    this.tasks = new PriorityQueue<{
      fn: () => Promise<any>;
      resolve: resolveType;
      reject: rejectType;
      priority: number;
    }>();
    this.threshold = limit;
    this.state = "OPEN";
    this.active = 0;
  }

  private rejectAll() {
    while (this.tasks.length() > 0) {
      const { reject } = this.tasks.pop()!;
      reject(new Error("Shutting down"));
    }
  }

  private startTask() {
    while (this.tasks.length() > 0 && this.active < this.threshold) {
      const { fn, resolve, reject } = this.tasks.pop()!;
      this.active++;

      Promise.resolve()
        .then(fn)
        .then(resolve)
        .catch(reject)
        .finally(() => {
          this.active--;
          if (
            this.state === "CLOSING" &&
            this.active === 0 &&
            this.tasks.length() == 0
          ) {
            this.state = "SHUT_DOWN";
            this.shutdownResolver?.("Jobs done");
            this.shutdownResolver = null;
            return;
          }
          //in case of a forcefull shutdown
          if (
            this.state === "SHUT_DOWN" &&
            this.shutdownResolver !== null &&
            this.active === 0
          ) {
            this.shutdownResolver?.("Jobs done");
            this.shutdownResolver = null;
            return;
          }
          this.startTask();
        });
    }
  }

  shutdown() {
    if (
      this.state === "SHUT_DOWN" ||
      this.state === "CLOSING" ||
      this.shutdownResolver
    ) {
      return Promise.resolve("the state is already closed or shutdown.");
    }
    this.state = "CLOSING";
    if (this.tasks.length() === 0 && this.active === 0) {
      this.state = "SHUT_DOWN";
      return Promise.resolve("Jobs done");
    }
    return new Promise((resolve) => {
      this.shutdownResolver = resolve;
    });
  }

  forceShutdown() {
    if (this.state === "SHUT_DOWN") {
      return Promise.resolve("Already shutdown");
    }

    if (this.shutdownResolver) {
      this.shutdownResolver?.("Force fully shutting down");
    }

    this.state = "SHUT_DOWN";
    this.rejectAll();

    if (this.active === 0) {
      return Promise.resolve("Jobs done");
    }

    return new Promise((resolve) => {
      this.shutdownResolver = resolve;
    });
  }

  run(fn: () => Promise<any>,priority:number): Promise<void> | undefined {
    if (this.state === "CLOSING" || this.state === "SHUT_DOWN") {
      console.log("Can't perform further tasks.");
      return;
    } else {
      return new Promise((resolve, reject) => {
        this.tasks.push({ fn, resolve, reject ,priority});
        this.startTask();
      });
    }
  }
}
