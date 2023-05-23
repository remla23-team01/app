const {VersionUtil} = require('@remla23-team01/lib')

console.log(VersionUtil.getVersion())

const env_vars = require('./env.json');
Object.keys(env_vars).forEach(function(k) {
    process.env[k] = env_vars[k];
});

window.addEventListener('load', function () {
    console.log(process.env.MY_APP_URL);
    getAllReviews()


    document.getElementById('predictSentimentBtn').addEventListener('click', function () {
        const text = document.getElementById('predictSentimentText').value;

        fetch(process.env.MY_APP_URL, {
            method: "POST",
            body: JSON.stringify({
                review: text,
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

    this.document.getElementById('allReviews')
});

function setSentimentCheckListeners(predicted_class) {
    document.getElementById('sentimentCheck').hidden = false 
    document.getElementById('isCorrect').addEventListener('click', function () { sendSentimentCheck(predicted_class, true)})
    document.getElementById('notCorrect').addEventListener('click',  function () {sendSentimentCheck(predicted_class, false)})
}

function sendSentimentCheck(predicted_class, correct) {
    fetch(process.env.MY_APP_CHECK_PREDICTION, {
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

async function getAllReviews() {
    fetch(process.env.MY_APP_All_REVIEWS, {
        method: "GET",
        headers: {
            "Content-type": "application/json"
        }
    })
        .then((response) => response.json())
        .then((json) => {

            let reviews = json.reviews
            let reviewsDiv = document.getElementById('allReviews')

            reviews.forEach(review => {
               reviewsDiv.innerHTML += "<p>" + review + "</p>" 
            });
        });
}
