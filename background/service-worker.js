chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type !== 'inject_content_scripts' && !request?.tabId) return

  chrome.scripting.executeScript({
    target: { tabId: request.tabId },
    files: [
      'content-scripts/config.js',
      'content-scripts/assets/js/content-script.js'
    ]
  })

  sendResponse({ success: true })

  return true
})
