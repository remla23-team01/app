const {VersionUtil} = require('@remla23-team01/lib')

console.log(VersionUtil.getVersion())

window.addEventListener('load', function () {

    document.getElementById('predictSentimentBtn').addEventListener('click', function () {
        const text = document.getElementById('predictSentimentText').value;

        fetch('http://model-service-serv:8080', {
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
            });
    });
});

