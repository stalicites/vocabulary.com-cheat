let instructionElementList = document.getElementsByClassName("instructions");
let finalElement = instructionElementList[instructionElementList.length - 1];
let word = finalElement.getElementsByTagName("strong")[0].innerText

let apis = [`https://vocabulary.vercel.app/word`,`https://vocabulary.vercel.app/words`];
let requests = [];
let dataResponses = []

for (let i = 0; i < apis.length; i++) {
    let q = new XMLHttpRequest();
    q.open("GET", `${apis[i]}/${word}`);
    requests.push(q);
    q.onload = () => {
        console.log("data received!");
        dataResponses.push(JSON.parse(q.responseText));
    }
    q.send();
}
