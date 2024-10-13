# Mini Translator

**Mini Translator** is a Chrome extension that allows users to translate selected text on a webpage to their desired language and listen to the translated text via text-to-speech. It also provides a popup interface for manual text input translation.

## Features

- **Context Menu Translation**: Right-click on selected text and translate it into a chosen language.
- **Popup Translation**: Manually input text in the popup and get an instant translation.
- **Text-to-Speech**: Listen to the translated text with a voice that matches the target language.
- **Language Selection**: Choose from various languages, and the extension will remember your choice.
  
## Installation

1. Clone or download this repository:
   ```bash
   git clone https://github.com/NSTechBytes/Mini-Translator.git
   ```
   
2. Open Chrome and go to `chrome://extensions/`.

3. Enable **Developer mode** (toggle in the top-right corner).

4. Click on **Load unpacked** and select the folder where you cloned/downloaded the repository.

5. The extension will now be available in your Chrome toolbar.

## Usage

### 1. Translate Selected Text (Context Menu)
- Select text on any webpage.
- Right-click and choose "Translate '%selected_text%'" from the context menu.
- The translation will be shown in the popup.

### 2. Popup Translation
- Click the Mini Translator icon in the Chrome toolbar.
- Select your preferred target language from the dropdown menu.
- Enter the text you want to translate and click the "Translate" button.
- The translated text will be displayed, and you can click the "Text-to-Speech" button to listen to the translation.

### 3. Text-to-Speech
- After translation, click the **TTS** button to hear the translated text in the target language’s voice.

## Screenshots
![Extension Preview Light Mode]
*Light mode view with media controls.*![Light](https://github.com/NSTechBytes/Projects-Templates/blob/main/Extensions/Mini%20Translator/Light.png)


![Extension Preview Dark Mode]
*Dark mode view with media controls.*![Dark](https://github.com/NSTechBytes/Projects-Templates/blob/main/Extensions/Mini%20Translator/Dark.png)




## Code Overview

### Manifest (`manifest.json`)

The manifest configures the extension by defining permissions, background scripts, action icons, and default popup:

```json
{
  "manifest_version": 3,
  "name": "Mini Translator",
  "version": "1.0",
  "description": "Translate selected text and listen to the translation.",
  "permissions": [
    "contextMenus",
    "storage",
    "activeTab",
    "scripting"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html",
    "default_icon": "icon.png"
  }
}
```

### Background Script (`background.js`)

The background script listens for context menu clicks and performs the translation using the Google Translate API.

```javascript
chrome.contextMenus.create({
    id: "translateText",
    title: "Translate '%s'",
    contexts: ["selection"]
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    // Handle translation logic
});
```

### Popup Script (`popup.js`)

The popup script handles text input translation and text-to-speech functionality.

```javascript
document.getElementById('translateBtn').addEventListener('click', () => {
    // Handle translation and display in popup
});
```

## Development

### Prerequisites

- [Google Chrome](https://www.google.com/chrome/)
- Basic knowledge of JavaScript, HTML, and Chrome Extensions

### Running the Project Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/NSTechBytes/Mini-Translator.git
   ```

2. Load the extension in **Developer Mode** as described in the Installation section.

### Files and Folders

- **manifest.json**: Defines the extension's metadata.
- **background.js**: Contains logic for the background service worker.
- **popup.html**: The HTML structure for the popup UI.
- **popup.js**: JavaScript for handling translations and interactions in the popup.
- **styles.css**: Styles for the popup interface.

## Known Issues

- Some languages may not support text-to-speech (TTS).
- Occasionally, the Google Translate API might limit requests if the quota is exceeded.

## Contributing

Contributions are welcome! If you have suggestions or encounter issues, feel free to submit a pull request or open an issue.

## License

This project is licensed under the Appache License. See the [LICENSE](LICENSE) file for more details.




