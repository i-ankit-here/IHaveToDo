export default function(){
    const evr = window.origin;
    const arr = [["http://localhost:5173","http://localhost:8010"],["https://ihavtodo.netlify.app/","https://ihavetodo.onrender.com"]]
    const n = arr.length;
    for(let i = 0;i<n;i++){
        const item = arr[i][0];
        if(item.includes(evr))return arr[i][1];
    }
    return arr[0][0];
}