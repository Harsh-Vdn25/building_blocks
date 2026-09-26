export class Node {
  key: number;
  val: number;
  expiresIn: number;
  next: Node | null;
  prev: Node | null;

  constructor({
    key,
    val,
    expireTime,
  }: {
    key: number;
    val: number;
    expireTime: number;
  }) {
    this.key = key;
    this.val = val;
    this.expiresIn = expireTime;
    this.next = null;
    this.prev = null;
  }
}

export class LRU {
  private map: Map<number, Node> = new Map();
  private _size: number = 0;
  private actualSize: number = 0;
  private head = new Node({ key: -1, val: -1, expireTime: -1 });
  private tail = new Node({ key: -1, val: -1, expireTime: -1 });
  constructor(size: number) {
    this._size = size;
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.cleanUp();
  }

  private insertAtFront(node: Node) {
    node.prev = this.head;
    this.head.next!.prev = node;
    node.next = this.head.next;
    this.head.next = node;
  }

  private deleteAtLast() {
    const node = this.tail.prev!;

    node.prev!.next = this.tail;
    this.tail.prev = node.prev!;
    this.actualSize--;
    this.map.delete(node.key);
  }

  put(key: number, val: number, time: number) {
    if (this.map.has(key)) {
      const existing = this.map.get(key) as Node;
      existing.val = val;
      existing.expiresIn = Date.now() + time;

      existing.prev!.next = existing.next;
      existing.next!.prev = existing.prev;

      this.insertAtFront(existing);
      return;
    }
    const expireTime = Date.now() + time;
    const newNode = new Node({ key, val, expireTime });

    this.map.set(key, newNode);
    this.insertAtFront(newNode);

    if (this.actualSize == this._size) {
      this.deleteAtLast();
    } else {
      this.actualSize++;
    }
  }

  private deleteNode(node: Node) {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  private cleanUp() {
    for (const [key, node] of this.map.entries()) {
      if (node.expiresIn <= Date.now()) {
        this.map.delete(key);
        this.deleteNode(node);
        this.actualSize--;
      }
    }
    setTimeout(()=>this.cleanUp(), 1000);
  }

  get(key: number): number {
    if (this.actualSize == 0 || !this.map.has(key)) return -1;

    const node = this.map.get(key)!;

    if (node.expiresIn <= Date.now()) {
      this.map.delete(key);
      this.actualSize--;
      this.deleteNode(node);
      return -1;
    }
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
    
    this.insertAtFront(node);
    return node.val;
  }

  front(): number {
    if (this.actualSize > 0) {
      return this.head.next!.val;
    }
    return -1;
  }
}

const lru = new LRU(3);

lru.put(1, 2, 210);
