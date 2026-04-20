/**
 * PROBLEM EXPLANATION:
 * Implement a `debounce` function that limits the rate at which a provided function gets called. It delays execution until after `wait` milliseconds have elapsed since the last time it was invoked.
 */

function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}


const handleTyping = debounce((text) => {
    console.log("User stopped typing:", text);
}, 500);

document.getElementById("search").addEventListener("input", (e) => {
    handleTyping(e.target.value);
});
