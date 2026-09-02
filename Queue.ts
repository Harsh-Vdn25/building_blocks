export class Queue<T>{
    private arr:T[] = [];
    private _size:number = 0;
    constructor(size:number){
        this._size = size;
    }

    contains(ele:T):boolean{
        return this.arr.includes(ele);
    }

    push(ele:T):void{
        if(this.arr.length == this._size){
            console.log("The queue is full");
            return;
        }
        this.arr.push(ele);
    }

    pop():T|null{
        if(this.arr.length==0)return null;

        return this.arr.shift() as T;
    }
    size():number{
        return this.arr.length;
    }
}

const q = new Queue<number>(3);

q.push(1);
q.push(1);
q.push(2);
q.push(2);