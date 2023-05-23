(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (process){(function (){

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
}).call(this)}).call(this,require('_process'))
},{"./env.json":3,"_process":1}],3:[function(require,module,exports){
module.exports={
    "MY_APP_URL": "http://localhost:8080/predict",
    "MY_APP_CHECK_PREDICTION": "http://localhost:8080/checkPrediction",
    "MY_APP_All_REVIEWS": "http://localhost:8080/getReviews",
    "MY_APP_All_PREDICTIONS": "http://localhost:8080/getPredictions",
    "MY_APP_CHANGE_ACTUAL": "http://localhost:8080/changeActual"
}
},{}]},{},[2]);