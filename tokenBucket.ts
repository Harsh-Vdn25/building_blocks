interface userInfo {
  tokens: number;
  lastRefill: number;
  rem:number;
}

export class TokenBucket {
  userMap: Map<number, userInfo>;
  private bucket_size: number;
  private refillFreq: number;

  constructor(size: number, limit: number) {
    this.bucket_size = size;
    this.userMap = new Map();
    //is number of tokens that are to be refilled every sec
    this.refillFreq = 60_000 / limit;
  }

  allow(id: number): boolean {
    if (!this.userMap.has(id)) {
      this.userMap.set(id, {
        tokens: this.bucket_size,
        lastRefill: Date.now(),
		rem:0
      });
    }

    
    let { tokens, lastRefill,rem } = this.userMap.get(id)!;
    if (tokens == this.bucket_size) {
      this.userMap.set(id, { tokens: tokens - 1, lastRefill: lastRefill,rem:rem });
      return true;
    }

	const time = Date.now();
    const calcTokens = Math.floor((time - lastRefill+rem) / this.refillFreq);
	rem = (time-lastRefill+rem)%this.refillFreq;

    if (tokens == 0 && calcTokens < 1) return false;
    this.userMap.set(id, {
      tokens: Math.min(this.bucket_size, tokens + calcTokens - 1),
      lastRefill: time,
	  rem:rem
    });
    return true;
  }
  
}
