function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function guessIfNoAnswer(choices, q, storedData) {
        let instructionElementList = document.getElementsByClassName("instructions");
        let finalElement = instructionElementList[instructionElementList.length - 1];
        let word = finalElement.getElementsByTagName("strong")[0].innerText
    
        let apis = [`https://vocabulary.vercel.app/words`,`https://vocabulary.vercel.app/word`];
        let requests = [];
        let dataResponses = []

        let index = 0;
        
        for (let i = 0; i < apis.length; i++) {
            let q = new XMLHttpRequest();
            q.open("GET", `${apis[i]}/${word}`);
            requests.push(q);
            q.onload = () => {
                console.log("data received!");
                let data = JSON.parse(q.responseText).data;
                if (typeof data == "string") {
                    index++;
                    dataResponses.push(data);   
                } else if (typeof data == "object") {
                    if (data.length) {
                         data.forEach((item) => {
                             index++;
                             dataResponses.push(item.description)
                         })   
                    } else {
                        console.log("some weird data :/", data);
                    }
                }
                if (i == apis.length - 1) {
                    console.log("execution finished!");
                    console.log(dataResponses.length);
                    let clicked = false;
                    dataResponses.forEach((def) => {
                        for (let i = 0; i < choices.length; i++) {
                            if (def.includes(choices[i].innerText)) {
                                choices[i].click();
                                console.log("Done!");
                                clicked = true;
                            }
                        }
                    })
                    if (!clicked) {
                        alert(dataResponses);
                    }
                }
            }
            q.send();
        }
    /*
    for (let i = 0; i < choices.length; i++) {
        if (choices[i]) {
            choices[i].click();
            await sleep(1000);
            console.log("Done!");
        }
    }
    let answerText = document.getElementsByClassName("correct is-disabled")[0].innerText;
    if (storedData[q]) {
        storedData[q].push(answerText);
    } else {
        storedData[q] = [answerText]
    }
    console.log(answerText);
    localStorage.setItem("dict", JSON.stringify(storedData));
    document.getElementsByClassName("btn-next")[0].click();
    */
}

document.onkeydown = (e) => {
    if (e.key == "/") {
        let instructionElementList;
        if (document.getElementsByClassName("instructions").length == 0) {
            instructionElementList = document.getElementsByClassName("sentence")  
        } else {
            instructionElementList = document.getElementsByClassName("instructions")
        }
        let q = instructionElementList[instructionElementList.length - 1].innerText;
        
        localStorage.getItem("dict") ? 0 : localStorage.setItem("dict", "{}");
        
        let storedData = JSON.parse(localStorage.getItem("dict"));
        let choices = document.getElementsByClassName("choices")[0].getElementsByTagName("a")
        if (storedData[q]) {
            console.log("Question exists");
            let finished = false;
            for (let i = 0; i < choices.length; i++) {
                let choice = choices[i]
                if (storedData[q] == choice.innerText) {
                    choice.click();
                    finished = true;
                    break;
                }
            }
            if (!finished) {
                console.log("there's a second answer!");
                guessIfNoAnswer(choices, q, storedData);    
                storedData[q].push()
            } else {
                document.getElementsByClassName("btn-next")[0].click();
            }
            console.log("answer: ", storedData[q]);
        } else {
            guessIfNoAnswer(choices, q, storedData);
        }
    }
}
