export class Node {
  key: number;
  val: number;
  next: Node | null;
  prev: Node | null;

  constructor({ key, val }: { key: number; val: number }) {
    this.key = key;
    this.val = val;
    this.next = null;
    this.prev = null;
  }
}

export class LRU {
  private map: Map<number, Node> = new Map();
  private _size: number = 0;
  private actualSize: number = 0;
  private head = new Node({ key: -1, val: -1 });
  private tail = new Node({ key: -1, val: -1 });
  constructor(size: number) {
    this._size = size;
    this.head.next = this.tail;
    this.tail.prev = this.head;
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

    this.map.delete(node.key);
  }

  put(key: number, val: number) {
    if (this.map.has(key)) {
      const existing = this.map.get(key) as Node;
      existing.val = val;

      existing.prev!.next = existing.next;
      existing.next!.prev = existing.prev;

      this.insertAtFront(existing);
      return;
    }
    const newNode = new Node({ key, val });
    this.map.set(key, newNode);
    this.insertAtFront(newNode);

    if (this.actualSize == this._size) {
      this.deleteAtLast();
    } else {
      this.actualSize++;
    }
  }

  get(key: number): number {
    if (this.actualSize == 0 || !this.map.has(key)) return -1;
    
    const node= this.map.get(key)!;

    node.prev!.next = node.next;
    node.next!.prev = node.prev;

    this.insertAtFront(node);
    return node.val;
  }

  front(): number {
    if(this.actualSize>0){
        return this.head.next!.val;
    }
    return -1;
  }
}

const lru = new LRU(3);

lru.put(1, 10);
lru.put(2, 20);
lru.put(3, 30);

console.log(`get value of key ${2}: ${lru.get(2)}`);
console.log(lru.front());
lru.put(4, 40);
console.log("lru front is: ", lru.front());
console.log(`get value of key ${1}: ${lru.get(1)}`);
