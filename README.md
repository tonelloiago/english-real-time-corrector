# English Realtime Corrector
A Chrome Extension that provides real-time English grammar and clarity corrections using the OpenAI API. As you type in any text field on the web, the extension analyzes your text and offers suggestions in a non-intrusive bubble.
## Features
-   **Real-time Analysis**: Automatically checks your text as you type (debounced to save API calls).
-   **Contextual Corrections**: Uses `gpt-4o-mini` to understand context and provide accurate improvements.
-   **Universal Support**: Works on `<textarea>`, `<input>`, and `contenteditable` elements across the web.
-   **Clean UI**: Suggestions appear in a floating bubble near your cursor.
-   **Secure**: Your OpenAI API key is stored locally in your browser.
## Installation
1.  **Clone or Download** this repository to your local machine.
2.  Open Google Chrome and navigate to `chrome://extensions`.
3.  Enable **Developer mode** in the top right corner.
4.  Click **Load unpacked**.
5.  Select the folder where you saved this project (`gpt-english-corrector`).
## Configuration
Before using the extension, you need to provide your OpenAI API key:
1.  Click the **English Realtime Corrector** icon in your Chrome toolbar.
2.  Paste your OpenAI API Key into the input field.
3.  Click **Save**.
> **Note**: You need an active OpenAI account with credits/billing enabled to use the API.
## Usage
1.  Navigate to any website with a text input (e.g., Gmail, Twitter, Slack web).
2.  Start typing in English.
3.  If the extension detects a grammar mistake or a way to improve clarity, a bubble will appear near your cursor.
4.  **Accept**: Click "Accept" to replace your text with the suggestion.
5.  **Ignore**: Click "Ignore" to dismiss the suggestion.
## Project Structure
-   `manifest.json`: Extension configuration (Manifest V3).
-   `background.js`: Handles API calls to OpenAI to keep secrets secure and manage cross-origin requests.
-   `content.js`: Injects logic into web pages to detect typing and show the UI.
-   `bubble.html` & `styles.css`: The UI for the suggestion bubble.
-   `popup/`: Contains the UI for entering your API key.
## Privacy
This extension sends the text you type in active fields to the OpenAI API for processing. No data is stored on external servers by the extension creator. Your API key is stored locally in your browser's `chrome.storage`.
