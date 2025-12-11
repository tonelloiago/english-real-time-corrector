// popup/popup.js
document.addEventListener("DOMContentLoaded", async () => {
    const tokenInput = document.getElementById("token");
    const { openai_key } = await chrome.storage.local.get("openai_key");
    if (openai_key) tokenInput.value = openai_key;

    document.getElementById("save").addEventListener("click", async () => {
        const token = tokenInput.value.trim();
        if (!token) return alert("Please paste your OpenAI API key.");
        await chrome.storage.local.set({ openai_key: token });
        alert("Token saved to chrome.storage.local");
    });

    document.getElementById("clear").addEventListener("click", async () => {
        await chrome.storage.local.remove("openai_key");
        tokenInput.value = "";
        alert("Token removed");
    });
});
