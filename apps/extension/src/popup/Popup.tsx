import React from 'react'
import browser from 'webextension-polyfill'
import './styles.css'

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
    <div className="popup-panel">
      <button className="popup-btn" onClick={onToggle}>
        <div className="popup-btn-inner">
          Toggle overlay
          <div className="popup-btn-kbd">
            <span>⌘</span>
            <span>⇧</span>
            <span>E</span>
          </div>
        </div>
      </button>
    </div>
  )
}

export default Popup
