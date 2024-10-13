// Function to copy text to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification();
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// Function to show notification
function showNotification() {
    const notification = document.getElementById('notification');
    notification.style.opacity = '1';
    setTimeout(() => {
        notification.style.opacity = '0';
    }, 2000); // Hide after 2 seconds
}

// Get query parameters from URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        text: params.get('text'),
        lang: params.get('lang')
    };
}

// Perform translation and update UI
async function performTranslation() {
    const { text, lang } = getQueryParams();
    document.getElementById('originalText').textContent = text;

    try {
        const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`);
        const data = await response.json();
        const translatedText = data[0][0][0];
        document.getElementById('translatedText').value = translatedText;
    } catch (error) {
        console.error('Error during translation:', error);
        document.getElementById('translatedText').value = 'Translation failed.';
    }
}

// Event listener for copy button
document.getElementById('copyBtn').addEventListener('click', () => {
    const text = document.getElementById('translatedText').value;
    copyToClipboard(text);
});

// Event listener for close button
document.getElementById('closePopup').addEventListener('click', () => {
    window.close();
});

// Perform translation when the popup loads
document.addEventListener('DOMContentLoaded', performTranslation);
