document.onkeydown = (e) => {
    if (e.key == "/") {
        let instructionElementList = document.getElementsByClassName("instructions");
        let finalElement = instructionElementList[instructionElementList.length - 1];
        let word = finalElement.getElementsByTagName("strong")[0].innerText
        
        localStorage.getItem("dict") ? 0 : localStorage.setItem("dict", "{}");
        
        let apis = [`https://vocabulary.vercel.app/word`,`https://vocabulary.vercel.app/words`];
        let requests = [];
        let dataResponses = []

        let index = 0;
        
        for (let i = 0; i < apis.length; i++) {
            index++;
            let q = new XMLHttpRequest();
            q.open("GET", `${apis[i]}/${word}`);
            requests.push(q);
            q.onload = () => {
                console.log("data received! checking & saving to dictionary");
                let data = JSON.parse(q.responseText).data;
                if (typeof data == "string") {
                     dataResponses.push(`${index}. ${data}`);   
                } else if (typeof data == "object") {
                    if (data.length) {
                         data.forEach((item) => {
                             index++;
                             dataResponses.push(`${index}. ${item.description}`)
                         })   
                    } else {
                        console.log("some weird data :/", data);
                    }
                }
                if (i == apis.length - 1) {
                    console.log("we're at the end");
                    console.log("data responses: ", dataResponses)
                    alert(`The definition of ${word} is: \n${dataResponses}`)
                }
            }
            q.send();
        }
        
    }
}
