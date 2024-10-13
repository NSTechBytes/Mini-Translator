// Load the previously selected language and dark mode preference from Chrome's storage
function loadSettings() {
  chrome.storage.sync.get(["selectedLanguage", "darkMode"], (result) => {
    const selectedLanguage = result.selectedLanguage || "en"; // Default to English if no language is set
    const darkMode = result.darkMode || false;

    document.getElementById("languageSelect").value = selectedLanguage;
    document.body.classList.toggle("dark-mode", darkMode);
    document
      .getElementById("darkModeToggle")
      .classList.toggle("fa-sun", !darkMode);
    document
      .getElementById("darkModeToggle")
      .classList.toggle("fa-moon", darkMode);
  });
}

// Handle language selection change and save it to storage
document
  .getElementById("languageSelect")
  .addEventListener("change", (event) => {
    const selectedLanguage = event.target.value;
    chrome.storage.sync.set({ selectedLanguage: selectedLanguage });
  });

// Handle translation button click
document.getElementById("translateBtn").addEventListener("click", () => {
  const inputText = document.getElementById("inputText").value;
  const targetLanguage = document.getElementById("languageSelect").value;

  if (inputText) {
    chrome.runtime.sendMessage(
      {
        action: "requestTranslation",
        inputText: inputText,
        targetLanguage: targetLanguage,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error:", chrome.runtime.lastError.message);
          document.getElementById("outputText").innerText =
            "Translation failed.";
          return;
        }

        if (response && response.translatedText) {
          document.getElementById("outputText").innerText =
            response.translatedText;
        } else {
          console.error("Translation failed or response is invalid:", response);
          document.getElementById("outputText").innerText =
            "Translation failed.";
        }
      }
    );
  }
});

// Text-to-speech functionality
document.getElementById("ttsBtn").addEventListener("click", () => {
  const outputText = document.getElementById("outputText").innerText;
  const targetLanguage = document.getElementById("languageSelect").value;

  if (outputText) {
    const voices = speechSynthesis.getVoices();
    let selectedVoice = null;

    for (let voice of voices) {
      if (voice.lang.startsWith(targetLanguage)) {
        selectedVoice = voice;
        break;
      }
    }

    if (selectedVoice) {
      const utterance = new SpeechSynthesisUtterance(outputText);
      utterance.voice = selectedVoice;
      speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not available for this language.");
    }
  }
});

// Dark mode toggle functionality
document.getElementById("darkModeToggle").addEventListener("click", () => {
  const darkMode = !document.body.classList.contains("dark-mode");
  document.body.classList.toggle("dark-mode", darkMode);

  // Toggle dark mode icon
  const darkModeIcon = document.getElementById("darkModeToggle");
  darkModeIcon.classList.toggle("fa-sun", !darkMode);
  darkModeIcon.classList.toggle("fa-moon", darkMode);

  // Save dark mode preference
  chrome.storage.sync.set({ darkMode: darkMode });
});

// Load settings when the popup opens
document.addEventListener("DOMContentLoaded", loadSettings);

// Handle copy code button click
document.getElementById("copyCodeBtn").addEventListener("click", () => {
  const outputText = document.getElementById("outputText").innerText;
  navigator.clipboard
    .writeText(outputText)
    .then(() => {
      const notification = document.createElement("div");
      notification.className = "notification";
      notification.innerText = "Code copied to clipboard!";
      document.body.appendChild(notification);
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 2000);
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
});

// Handle upload file button click
document.getElementById("uploadFileBtn").addEventListener("click", () => {
  document.getElementById("fileInput").click();
});

// Handle file input change
document.getElementById("fileInput").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const fileContent = e.target.result;
      const targetLanguage = document.getElementById("languageSelect").value;

      // Send file content for translation
      chrome.runtime.sendMessage(
        {
          action: "requestTranslation",
          inputText: fileContent,
          targetLanguage: targetLanguage,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error:", chrome.runtime.lastError.message);
            document.getElementById("outputText").innerText =
              "Translation failed.";
            return;
          }

          if (response && response.translatedText) {
            document.getElementById("outputText").innerText =
              response.translatedText;
          } else {
            console.error(
              "Translation failed or response is invalid:",
              response
            );
            document.getElementById("outputText").innerText =
              "Translation failed.";
          }
        }
      );
    };
    reader.readAsText(file);
  }
});

// Handle download file button click
document.getElementById("downloadFileBtn").addEventListener("click", () => {
  const translatedText = document.getElementById("outputText").innerText;

  if (translatedText) {
    const blob = new Blob([translatedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "translated_text.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } else {
    alert("No text to download.");
  }
});

function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.opacity = "1";
  setTimeout(() => {
    notification.style.opacity = "0";
  }, 2000); // Hide after 2 seconds
}
