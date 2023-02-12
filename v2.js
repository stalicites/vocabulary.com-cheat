function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

document.onkeydown = async (e) => {
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
        if (storedData[q]) {
            console.log("Question exists");
            alert(storedData[q]);
        } else {
            let choices = document.getElementsByClassName("choices")[0].getElementsByTagName("a")
            for (let i = 0; i < choices.length; i++) {
                if (choices[i]) {
                    choices[i].click();
                    await sleep(1000);
                    console.log("Done!");
                }
            }
            let answerText = document.getElementsByClassName("correct")[2].innerText
            storedData[q] = answerText
            console.log(answerText);
            localStorage.setItem("dict", JSON.stringify(storedData))
        }
    }
}
