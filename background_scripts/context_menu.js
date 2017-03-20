// Create menu option for right click with selected text
browser.contextMenus.create({
  id: "get-information",
  title: "More information about %s",
  contexts: ["selection"]
});

browser.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId == "get-information") {
    // Executes get_paragraph_text.js in open tab
    browser.tabs.executeScript(tab.id, {
      file: "../content_scripts/get_paragraph_text.js"
    });
  }
});
