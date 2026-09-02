export class Node<T>{
    val:T;
    next:Node<T>|null;
    constructor(val:T){
        this.val = val;
        this.next = null;
    }
}

export class QueueLL<T>{
    private actualSize:number = 0;

    root:Node<T>|null = null;
    tail:Node<T>|null = null;
    
    enqueue(ele:T){
        const newNode = new Node(ele);
        this.actualSize++;
        if(this.tail == null){
            this.root = newNode;
            this.tail = newNode;
            return;
        }
        this.tail.next = newNode;
        this.tail = newNode;
    }

    dequeue():T|null{
        if(this.root == null)return null;
        const value = this.root.val;
        this.root = this.root.next
        this.actualSize--;
        return value;
    }

    size():number{
        return this.actualSize;
    }
    
    isEmpty():boolean{
        return this.actualSize == 0;
    }
}

const q = new QueueLL<number>();
q.enqueue(1);
q.enqueue(2);
q.enqueue(3);
console.log(`size of the queue is ${q.size()}`);
console.log(q.dequeue());
console.log(q.dequeue());
console.log(q.dequeue());
console.log(q.isEmpty() ? "Queue is empty" : q.dequeue());