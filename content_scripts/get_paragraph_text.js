getSelectedText();

// Gets the selected text & paragraph text and passes them to the main script: index.js
function getSelectedText() {
  var selected_text = window.getSelection().toString();
  var paragraph_text = window.getSelection().anchorNode.parentNode.textContent;

  browser.runtime.sendMessage({"type": "query", "selected_text": selected_text, "paragraph_text": paragraph_text});
}
