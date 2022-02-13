import React from 'react'
import browser from 'webextension-polyfill'

const Popup = () => {
  const onToggle = React.useCallback(() => {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      const tab = tabs[0]
      if (tab.id) {
        browser.tabs.sendMessage(tab.id, {
          toggle: true,
        })
      }
    })
  }, [])

  return (
    <>
      <button onClick={onToggle}>Toggle tldraw overlay</button>
    </>
  )
}

export default Popup
