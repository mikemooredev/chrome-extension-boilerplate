class Popup {
  constructor () {
    this.setupListeners()
  }

  setupListeners  () {
    document.addEventListener('DOMContentLoaded', this.handleDomReady.bind(this))
  }

  async handleDomReady () {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    this.currentTab = tabs[0]
    if(!this.currentTab?.id) return

    chrome.tabs.sendMessage(this.currentTab.id, { type: 'does_content_script_exist' }, (response) => {
      if (!response?.success) {
        chrome.runtime.sendMessage({
          type: 'inject_content_scripts',
          tabId: this.currentTab.id
        })
      } else {
        this.requestPageData()
      }
    })
  }

  requestPageData() {
    chrome.tabs.sendMessage(this.currentTab.id, { type: 'page_data_for_popup' }, this.handleResponseFromTab.bind(this))
  }

  handleChromeRuntimeMessages (request, sender, sendResponse) {
    if(request.type !== 'content_script_loaded') return

    this.requestPageData()
  }

  handleResponseFromTab (response) {
    // render app
  }

  get el () {
    return document.getElementById('app')
  }
}

const popup = new Popup()
