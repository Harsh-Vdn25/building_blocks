type withPriority = {
    priority:number;
}

export class PriorityQueue<T extends withPriority>{
    private minHeap:T[];

    constructor(){
        this.minHeap = [];
    }

    push(ele:T){
        this.minHeap.push(ele);
        let i = this.minHeap.length-1;

        while(i>0){
            let parent = Math.floor((i-1)/2);

            if(this.minHeap[parent].priority<this.minHeap[i].priority)
                break;

            const temp = this.minHeap[parent];
            this.minHeap[parent] = this.minHeap[i];
            this.minHeap[i] = temp;

            i = parent;
        }
    }

    pop(){
        if(this.minHeap.length===0){
            return null;
        }

        const ele = this.minHeap[0];
        this.minHeap[0] = this.minHeap[this.minHeap.length-1];
        this.minHeap.pop();

        this.heapify(0,this.minHeap.length);
        return ele;
    }

    private heapify(idx:number,size:number){
        let smallest = idx;
        let left = 2*idx+1;
        let right = 2*idx+2;

        if(left<size && this.minHeap[left].priority<this.minHeap[smallest].priority){
            smallest = left;
        }

        if(right<size && this.minHeap[right].priority<this.minHeap[smallest].priority){
            smallest = right
        }
        
        if(smallest!=idx){
            const temp = this.minHeap[idx];
            this.minHeap[idx] = this.minHeap[smallest];
            this.minHeap[smallest] = temp;
            this.heapify(smallest,size);
        }
    }
    length(){
        return this.minHeap.length;
    }
}
