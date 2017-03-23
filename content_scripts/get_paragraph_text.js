getSelectedText();

// Gets the selected text & paragraph text and passes them to the main script: index.js
function getSelectedText() {
  var selection = window.getSelection();
  
  var selected_text = selection.toString();
  var paragraph_text = selection.anchorNode.parentNode.textContent;

  browser.runtime.sendMessage({"type": "query", "selected_text": selected_text, "paragraph_text": paragraph_text});
}
