export default function(){
    const evr = window.origin;
    const arr = ["http://localhost:8010","https://ihavetodo.vercel.app"]
    const n = arr.length;
    for(let i = 0;i<n;i++){
        const item = arr[i];
        if(item.includes(evr))return item;
    }
    return arr[0];
}