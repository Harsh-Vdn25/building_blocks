export const throttle=(fn:(...args:any[])=>void,delay:number)=>{
    let completed:boolean = false;
   
    return (...args:any[])=>{
        if(completed)return;
        fn(...args);
        completed = true;

        setTimeout(()=>{
            completed = false;
        },delay);
    }
}

export const debounce=(fn:(...args:any[])=>void,delay:number)=>{
    let timer:ReturnType<typeof setTimeout>|null = null;

    return (...args:any[])=>{
        if(timer!=null){
            clearTimeout(timer);
        }

        timer = setTimeout(()=>{
            fn(...args);
            timer = null;
        },delay)
    }
}


const search = debounce((query: string) => {
  console.log("Searching:", query);
}, 500);

search("r");
search("re");
search("rea");
search("react");