const {VersionUtil} = require('@remla23-team01/lib')

console.log(VersionUtil.getVersion())

window.addEventListener('load', function () {

    document.getElementById('predictSentimentBtn').addEventListener('click', function () {
        const text = document.getElementById('predictSentimentText').value;

        fetch('http://localhost:8080', {
            method: "POST",
            body: JSON.stringify({
                msg: text,
            }),
            headers: {
                "Content-type": "application/json"
            }
        })
            .then((response) => response.json())
            .then((json) => {
                document.getElementById('output').innerText = json.predicted_class ? ':)' : ':(';
                setSentimentCheckListeners(json.predicted_class)
            });
    });
});

function setSentimentCheckListeners(predicted_class) {
    document.getElementById('sentimentCheck').hidden = false 
    document.getElementById('isCorrect').addEventListener('click', function () { sendSentimentCheck(predicted_class, true)})
    document.getElementById('notCorrect').addEventListener('click',  function () {sendSentimentCheck(predicted_class, false)})
}

function sendSentimentCheck(predicted_class, correct) {
    fetch('http://127.0.0.1:8080/checkPrediction', {
        method: "POST",
        body: JSON.stringify({
            predicted_class: predicted_class,
            prediction_correct: correct
        }),
        headers: {
            "Content-type": "application/json"
        }
    })
    document.getElementById('sentimentCheck').hidden = true 
    document.getElementById('feedback').hidden = false 
}

