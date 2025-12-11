
const DEBOUNCE_MS = 800;
const MAX_CHARS = 1200;

let timers = new WeakMap();

async function createSuggestionBubble() {
    const div = document.createElement("div");
    div.className = "ec-suggestion-bubble";

    try {
        const url = chrome.runtime.getURL("bubble.html");
        const response = await fetch(url);
        const html = await response.text();
        div.innerHTML = html;
        document.body.appendChild(div);

        div.querySelector(".ec-accept").addEventListener("click", () => {
            const el = div._targetElement;
            const corrected = div._corrected;

            if (el && corrected != null) {
                el.value = corrected;
                el.dispatchEvent(new Event('input', { bubbles: true }));
            }
            hideBubble();
        });
        div.querySelector(".ec-ignore").addEventListener("click", () => hideBubble());
    } catch (e) {
        console.error("Failed to load bubble HTML", e);
    }

    return div;
}

function showBubbleAtElement(bubble, el, corrected) {
    bubble._targetElement = el;
    bubble._corrected = corrected;
    const textEl = bubble.querySelector("#ec-text");
    textEl.textContent = corrected;
    bubble.style.display = "block";

    const rect = el.getBoundingClientRect();
    const top = rect.bottom + window.scrollY + 6;
    const left = Math.min(window.innerWidth - 320, rect.left + window.scrollX);
    bubble.style.position = "absolute";
    bubble.style.top = `${top}px`;
    bubble.style.left = `${left}px`;
    bubble.style.maxWidth = "360px";
    bubble.style.zIndex = 2147483647;
}

function hideBubble() {
    const b = document.querySelector(".ec-suggestion-bubble");
    if (b) b.style.display = "none";
}

let bubble;
createSuggestionBubble().then(b => bubble = b);

document.addEventListener("input", (e) => {
    const target = e.target;
    if (!target.matches("textarea, input[type='text'], input[type='search'], [contenteditable='true']")) return;

    clearTimeout(timers.get(target));
    timers.set(target, setTimeout(async () => {
        const text = (target.value !== undefined) ? target.value : target.innerText;
        if (!text || text.trim().length === 0) return;
        if (text.length > MAX_CHARS) return;

        chrome.runtime.sendMessage({ type: "correct", text }, (res) => {
            if (!res) return;
            if (res.error) {
                console.warn("OpenAI error:", res.error, res.raw || "");
                return;
            }
            const corrected = res.corrected;
            if (corrected && corrected !== text) {
                showBubbleAtElement(bubble, target, corrected);
            } else {
                hideBubble();
            }
        });
    }, DEBOUNCE_MS));
});
