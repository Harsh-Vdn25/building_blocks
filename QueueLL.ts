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
    sizeLimit:number;

    constructor(limit:number){
        this.sizeLimit = limit;
    }

    enqueue(ele:T){
        if(this.actualSize>=this.sizeLimit){
            console.log("The queue is full.");
            return;
        }

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
        this.root = this.root.next;
        this.actualSize--;
        if(this.root === null){
            this.tail = null;
        }
        return value;
    }

    top():T|null{
        if(this.root===null){
            return null;
        }
        return this.root.val;
    }

    size():number{
        return this.actualSize;
    }
    
    isEmpty():boolean{
        return this.actualSize == 0;
    }
}

