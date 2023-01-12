const res = await fetch('https://kingsleague.pro/estadisticas/clasificacion/');
console.log(res);
const text = await res.text();

console.log(text);
