function removeNewLines (string) {
  if(!string) return

  return string.replace(/(\r\n|\n|\r)/gm, '')?.trim()
}

function handleise (string) {
  if(!string) return

  return string?.toLowerCase()?.replace(/[^a-z0-9]+/g, '-')?.replace(/-$/, '')?.replace(/^-/, '')?.trim()
}

class ContentScript {
  static config = {
    mode: window.MMD?.ChromeExtension?.mode,
  }

  constructor () {
    chrome.runtime.sendMessage({ type: 'content_script_loaded' })

    this.setupListeners()
  }

  setupListeners () {
    chrome.runtime.onMessage.addListener(this.handleChromeRuntimeMessages.bind(this))
  }

  handleChromeRuntimeMessages (request, sender, sendResponse) {
    if (request.type === 'does_content_script_exist') {
      sendResponse({ success: true })
    }

    if (request.type === 'page_data_for_popup') {
      this.sendPageDataForPopup(sendResponse)
    }
    return true
  }

  sendPageDataForPopup(sendResponse) {
    const response = {
      title: document.title,
      permalink: window.location.href,
    }

    this.log(response)

    sendResponse(response)
  }

  log (param) {
    if(this.isProduction) return

    console.log(param)
  }

  get mode () {
    return this.constructor?.config?.mode || 'production'
  }

  get isProduction () {
    return this.mode === 'production'
  }
}

const contentScript = new ContentScript()
