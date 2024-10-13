// Create context menu for translation
chrome.contextMenus.create({
  id: "translateText",
  title: "Translate '%s'",
  contexts: ["selection"],
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "translateText") {
    const selectedText = info.selectionText;

    // Retrieve the selected language from storage
    chrome.storage.sync.get("selectedLanguage", (result) => {
      const targetLang = result.selectedLanguage || "en"; // Default to English if no language is set

      // Open the context menu popup with the selected text
      chrome.windows.create({
        url: `contextPopup.html?text=${encodeURIComponent(
          selectedText
        )}&lang=${targetLang}`,
        type: "popup",
        width: 500, // Increased width
        height: 400, // Increased height
      });
    });
  }
});

async function translateText(text, targetLang) {
  const maxChunkSize = 5000; // Adjust based on API limits
  let translatedText = "";
  let start = 0;

  while (start < text.length) {
    let chunk = text.substring(start, start + maxChunkSize);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(
      chunk
    )}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      translatedText += data[0][0][0];
    } catch (error) {
      console.error("Error during translation:", error);
      return "Translation failed.";
    }
    start += maxChunkSize;
  }

  return translatedText;
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "requestTranslation") {
    const { inputText, targetLanguage } = message;

    translateText(inputText, targetLanguage)
      .then((translatedText) => {
        sendResponse({ translatedText });
      })
      .catch((error) => {
        console.error("Error during translation:", error);
        sendResponse({ error: "Failed to translate text." });
      });

    // Indicate that the response is sent asynchronously
    return true;
  }
});
