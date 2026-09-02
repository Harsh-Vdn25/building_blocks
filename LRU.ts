export class Node{
    key:number;
    val:number;
    next:Node|null;
    prev:Node|null;

    constructor({key,val}:{
        key:number,
        val:number
    }){
        this.key = key;
        this.val = val;
        this.next = null;
        this.prev = null;
    }
}

export class LRU{
    private map:Map<number,Node> = new Map();
    _size:number = 0;
    actualSize:number = 0;

    head = new Node({key:-1,val:-1});
    tail = new Node({key:-1,val:-1});

    constructor(size:number){
        this._size = size;
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }
    
    private insertAtFront(node:Node):void{
        node.next = this.head.next;
        this.head.next!.prev = node;
        this.head.next = node;
        node.prev = this.head;
    }

    private deleteLast(){
        let node = this.map.get(this.tail.prev?.key as number) as Node;
        (node.next as Node).prev = node.prev;
        (node.prev as Node).next = node.next;
        this.map.delete(node.key);
    }

    put(key:number,val:number){
        const newNode = new Node({key,val});
        this.map.set(key,newNode);
        if(this.actualSize === this._size){
            this.insertAtFront(newNode);
            this.deleteLast();
            return;
        }
        this.actualSize++;
        this.insertAtFront(this.map.get(key) as Node);
    }

    get(key:number):number|null{
        if(!this.map.has(key))return null;
    
        let node = this.map.get(key) as Node;
        node.prev!.next = node.next;
        node.next!.prev = node.prev;
        this.insertAtFront(node);
        return node.val;
    }

    front():number|null{
        if(this.actualSize==0)return null;

        return this.head.next?.val as number;
    }
}

const lru = new LRU(3);

lru.put(1,10);
lru.put(2,20);
lru.put(3,30);

console.log(`get value of key ${2} ${lru.get(2)}`);
console.log(lru.front());
lru.put(4,40);
console.log( "lru front is: ",lru.front());
console.log(`get value of key ${1} ${lru.get(1)}`);