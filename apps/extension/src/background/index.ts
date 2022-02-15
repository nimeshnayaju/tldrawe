import browser from 'webextension-polyfill'

const handleZoomChange = (info: browser.Tabs.OnZoomChangeZoomChangeInfoType) => {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    const tab = tabs[0]
    if (tab.id === info.tabId) {
      browser.tabs
        .sendMessage(tab.id, {
          zoom: info.newZoomFactor,
        })
        .catch((err) => {
          console.warn(err)
        })
    }
  })
}

const handleMessage = (message: any) => {
  if (message.type === 'zoom') {
    return browser.tabs.getZoom()
  }
}

browser.runtime.onMessage.addListener(handleMessage)

browser.tabs.onZoomChange.addListener(handleZoomChange)
