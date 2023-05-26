
const env_vars = require('./env.json');
Object.keys(env_vars).forEach(function(k) {
    process.env[k] = env_vars[k];
});


window.addEventListener('load', function () {
    console.log(process.env.MY_APP_URL);
    getAllPredictions(true)
    this.document.getElementById('trainCSV').addEventListener('click', function() {getAllPredictions(false)})
    this.document.getElementById('htmlTable').addEventListener('click', function() {getAllPredictions(true)})
})

async function getAllPredictions(showAsTable) {
    fetch(process.env.MY_APP_All_PREDICTIONS, {
        method: "GET",
        headers: {
            "Content-type": "application/json"
        }
    })
        .then((response) => response.json())
        .then((json) => {

            //  Reverse to add latest reviews first
            let reviews = json.reviews.reverse()
            if (showAsTable) {
                showReviewsInTable(reviews)
                this.document.getElementById('htmlTable').hidden = true
                this.document.getElementById('trainCSV').hidden = false
            }
            else {
                showReviewsAsTraingData(reviews)
                this.document.getElementById('trainCSV').hidden = true
                this.document.getElementById('htmlTable').hidden = false
            }
        });
    
}

async function showReviewsInTable(reviews) {
    let reviewsDiv = document.getElementById('allReviews')
    reviewsDiv.innerHTML = ""
    reviewsDiv.innerText = ""

    var table = `<table>
    <tr>
     <td>id</td>
     <td>review</td>
     <td>predicted class</td>
     <td>actual class</td>
    </tr>`

    reviews.forEach(review => {
       table += "<tr>" + reviewToString(review) + "</tr>" 
    });

    table += '</table>'
    reviewsDiv.innerHTML = table

    reviews.forEach(review => {
        document.getElementById(`${review.id}_pos`).addEventListener('click', function () {updateActual(review.id, 1)})
        document.getElementById(`${review.id}_neg`).addEventListener('click', function () {updateActual(review.id, 0)})
     });
}

async function showReviewsAsTraingData(reviews) {
    let reviewsDiv = document.getElementById('allReviews')
    reviewsDiv.innerHTML = ""
    reviewsDiv.innerText = ""
    reviews.forEach(review => {
        reviewsDiv.innerHTML += `${review.review}, ${review.actual} </br>`
    });
}


async function updateActual(reviewId, actualClass) {
    fetch(process.env.MY_APP_CHANGE_ACTUAL, {
        method: "POST",
        body: JSON.stringify({
            reviewId: reviewId,
            actual: actualClass
        }),
        headers: {
            "Content-type": "application/json"
        }
    })

    document.getElementById(`${reviewId}_actual`).innerText = classToSentiment(actualClass)
    
}


function reviewToString(review) {
    return `<td>${review.id}</td>
    <td>${review.review}</td>
    <td>${classToSentiment(review.predicted)}</td>
    <td id="${review.id}_actual">${classToSentiment(review.actual)}</td>
    <td><button id="${review.id}_pos">Mark positive</button></td>
    <td><button id="${review.id}_neg">Mark negative</button></td>
    `
}

function classToSentiment(sentimentClass) {
    if (sentimentClass == 0)
        return "Negative"
    else if (sentimentClass == 1)
        return "Positive"
    else
        return "Unknown"
}