document.addEventListener('DOMContentLoaded', function() {
    const solveButton = document.getElementById("solveButton");
    if (solveButton) {
      solveButton.addEventListener("click", function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['solver.js']
          }, () => {
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              func: () => window.main()  // Call the function after the content script is loaded
            });
          });
        });
      });
    } else {
      console.error("Element with ID 'solveButton' not found.");
    }
  });
  