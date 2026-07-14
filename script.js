const display=document.getElementById("display");
const expression=document.getElementById("expression");
const historyPanel=document.getElementById("historyPanel");
const historyBtn=document.getElementById("historyBtn");
const closeHistory=document.getElementById("closeHistory");
const historyList=document.getElementById("historyList");
const clearHistory=document.getElementById("clearHistory");

display.value="0";

function append(value){

if(display.value==="0"||display.value==="Error"){
display.value=value;
}
else{

let last=display.value.slice(-1);

if("+-*/%".includes(last)&&"+-*/%".includes(value)){
return;
}

display.value+=value;

}

}

function clearDisplay(){

display.value="0";
expression.textContent="";

}

function deleteLast(){

if(display.value.length>1){
display.value=display.value.slice(0,-1);
}
else{
display.value="0";
}

}

function plusMinus(){

if(display.value==="0") return;

if(display.value.startsWith("-")){
display.value=display.value.substring(1);
}
else{
display.value="-"+display.value;
}

}

function calculate(){

try{

let exp=display.value.replace(/×/g,"*").replace(/÷/g,"/");

exp=exp.replace(/(\d+(\.\d+)?)%/g,"($1/100)");

let result=eval(exp);

if(!isFinite(result)){
throw Error();
}

result=Number(result.toFixed(8));

expression.textContent=display.value;

display.value=result;

saveHistory(expression.textContent,result);

}
catch{

display.value="Error";

}

}function saveHistory(exp,result){
let history=JSON.parse(localStorage.getItem("history"))||[];
history.unshift({expression:exp,result:result,time:new Date().toLocaleTimeString([],{
hour:"2-digit",
minute:"2-digit"
})});
localStorage.setItem("history",JSON.stringify(history));
loadHistory();
}

function loadHistory(){
let history=JSON.parse(localStorage.getItem("history"))||[];
historyList.innerHTML="";
if(history.length===0){
historyList.innerHTML="<p style='text-align:center;color:#777;margin-top:30px;'>No History</p>";
return;
}
history.forEach(item=>{
historyList.innerHTML+=`
<div class="history-item">
<p>${item.expression}</p>
<p>= ${item.result}</p>
</div>`;
});
}

historyBtn.onclick=()=>{
historyPanel.classList.add("active");
}

closeHistory.onclick=()=>{
historyPanel.classList.remove("active");
}

clearHistory.onclick=()=>{
localStorage.removeItem("history");
historyList.innerHTML="<p style='text-align:center;color:#777;margin-top:30px;'>No History</p>";
}

historyList.addEventListener("click",e=>{
let item=e.target.closest(".history-item");
if(!item)return;
display.value=item.querySelector("p").innerText;
expression.textContent="";
historyPanel.classList.remove("active");
});

document.addEventListener("keydown",e=>{

if(!isNaN(e.key)){
append(e.key);
}

if(["+","-","*","/","."].includes(e.key)){
append(e.key);
}

if(e.key==="Enter"){
e.preventDefault();
calculate();
}

if(e.key==="Backspace"){
deleteLast();
}

if(e.key==="Escape"){
clearDisplay();
}

});

loadHistory();