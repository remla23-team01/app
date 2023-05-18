const {VersionUtil} = require('@remla23-team01/lib')

console.log(VersionUtil.getVersion())

const env_vars = require('./env.json');
Object.keys(env_vars).forEach(function(k) {
    process.env[k] = env_vars[k];
});

window.addEventListener('load', function () {
    console.log(process.env.MY_APP_URL);

    document.getElementById('predictSentimentBtn').addEventListener('click', function () {
        const text = document.getElementById('predictSentimentText').value;

        fetch(process.env.MY_APP_URL, {
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

