const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL_NAME = "gpt-4o-mini";

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type !== "correct") return;

    handleCorrectionRequest(msg.text)
        .then(response => sendResponse(response))
        .catch(err => sendResponse({ error: err.message }));

    return true;
});

async function handleCorrectionRequest(text) {
    const apiKey = await getApiKey();
    if (!apiKey) {
        return { error: "No API key stored. Open popup and save your OpenAI API key." };
    }

    try {
        const correction = await fetchCorrection(text, apiKey);
        return { corrected: correction };
    } catch (error) {
        return { error: `API error: ${error.message}` };
    }
}

async function getApiKey() {
    const { openai_key } = await chrome.storage.local.get("openai_key");
    return openai_key;
}

async function fetchCorrection(text, apiKey) {
    const prompt = `You are an English writing corrector. Return only the corrected version of the user's text with improved grammar and clarity. 
    Do not include any explanations or conversational text.
    Original: ${text}`;

    const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: MODEL_NAME,
            messages: [
                { role: "system", content: "You are a helpful assistant that corrects grammar." },
                { role: "user", content: prompt }
            ],
            max_tokens: 400
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.status} ${errorText}`);
    }

    const data = await response.json();
    const correctedText = data.choices?.[0]?.message?.content?.trim();

    if (!correctedText) {
        throw new Error("Could not parse response from OpenAI.");
    }

    return correctedText;
}
