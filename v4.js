    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    let wordsBeingLearned = [];
    
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://www.vocabulary.com/account/progress/words/priority');
    xhr.onload = function() {
        const el = document.createElement('div');
        el.innerHTML += (xhr.response);
        let wordElements = el.getElementsByClassName("word")    
        console.log(wordElements)
        for (let i = 0; i < wordElements.length; i++) {
            wordsBeingLearned.push(wordElements[i].innerText)
        }
    };
    xhr.send();

    console.log("WORDS BEING LEARNED:", wordsBeingLearned)
    
    async function guessIfNoAnswer(choices, q, storedData) {
            let instructionElementList = document.getElementsByClassName("instructions");
            let finalElement = instructionElementList[instructionElementList.length - 1];
            let word = "";

            try {
                word = finalElement.getElementsByTagName("strong")[0].innerText
                let apis = [`https://vocabulary.vercel.app/words`,`https://vocabulary.vercel.app/word`];
            let requests = [];
            let dataResponses = []
    
            let index = 0;
            
            for (let i = 0; i < apis.length; i++) {
                let q = new XMLHttpRequest();
                q.open("GET", `${apis[i]}/${word}`);
                requests.push(q);
                q.onload = async () => {
                    console.log("data received!");
                    let data = JSON.parse(q.responseText).data;
                    if (typeof data == "string") {
                        index++;
                        dataResponses.push(data);   
                    } else if (typeof data == "object") {
                        if (data.length) {
                            data.forEach((item) => {
                                index++;
                                dataResponses.push(item.description + "<br>")
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
                                let text = choices[i].innerText
                                if (def.includes(text) || text.includes(def)) {
                                    choices[i].click();
                                    console.log("Done!");
                                    clicked = true;
                                }
                            }
                        })
                        if (!clicked) {
                            document.getElementsByClassName("instructions")[0].innerHTML += `<br>
                            <p style="body-color: blue; font-size: 15px;">
                            ${dataResponses}
                            </p>
                            `;
                        }
                    }
                }
                q.send();
            }
            } catch {
                console.log("Looking over options!")
                let positions = []
                let choices = document.getElementsByClassName("choices")[0].getElementsByTagName("a")
                for (let i = 0; i < choices.length; i++) {
                    for (let j = 0; j < wordsBeingLearned.length; j++) {
                        if (choices[i].innerText.includes(wordsBeingLearned[j])) {
                            console.log("MATCH!")
                            positions.push({
                                word: choices[i].innerText,
                                position: j,
                                element: choices[i]
                            })
                        }
                    }
                }
                console.log(positions)
                positions.sort(function(a, b) { 
                    return a.position - b.position;
                })
                positions[0].element.click();
            }

            

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
