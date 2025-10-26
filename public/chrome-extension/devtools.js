// Create a DevTools panel
chrome.devtools.panels.create(
  "Clausia",
  "icon48.png",
  "panel.html",
  (panel) => {
    console.log("Clausia panel created");
  }
);
