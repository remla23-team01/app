const {VersionUtil} = require('@remla23-team01/lib')

console.log(VersionUtil.getVersion())

window.addEventListener('load', function () {

    document.getElementById('predictSentimentBtn').addEventListener('click', function () {
        const text = document.getElementById('predictSentimentText').value;

        fetch('http://127.0.0.1:8080', {
            method: "POST",
            body: JSON.stringify({
                msg: text,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then((response) => {
                document.getElementById('output').innerText = response.json().predicted_class;
            });
    });
});

