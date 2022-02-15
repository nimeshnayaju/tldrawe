import React from 'react'
import { Tldraw } from '@tldrawe/tldraw'
import isHotkey from 'is-hotkey'
import browser from 'webextension-polyfill'
import { usePan } from './hooks'

const TOGGLE_OVERLAY = 'mod+shift+e'

const Content = () => {
  const [showOverlay, setShowOverlay] = React.useState<boolean>(false)
  const { setZoom, onMount, onPan, onChangePage } = usePan()

  /**
   * Register an event listener to listen to keyboard events to toggle overlay
   */
  React.useEffect(() => {
    const displayOverlayKeyHandler = (e: KeyboardEvent) => {
      if (isHotkey(TOGGLE_OVERLAY, e)) {
        setShowOverlay((showOverlay) => !showOverlay)
      }
    }

    window.addEventListener('keydown', displayOverlayKeyHandler, false)

    return () => {
      window.addEventListener('keydown', displayOverlayKeyHandler, false)
    }
  }, [])

  /**
   * Register an event listener to listen to messages from an extension process
   */
  React.useEffect(() => {
    const onReceiveMessage = (message: any) => {
      if (message.toggle) {
        setShowOverlay((showOverlay) => !showOverlay)
      }
      if (message.zoom) {
        setZoom(message.zoom)
      }
    }

    browser.runtime.onMessage.addListener(onReceiveMessage)

    return () => {
      browser.runtime.onMessage.removeListener(onReceiveMessage)
    }
  }, [])

  return (
    <>
      {showOverlay && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            height: '100%',
            width: '100%',
            zIndex: 1000,
          }}
        >
          <Tldraw
            onPan={onPan}
            onMount={onMount}
            showMenu={true}
            showSponsorLink={false}
            showZoom={false}
            showPages={false}
            onChangePage={onChangePage}
          />
        </div>
      )}
    </>
  )
}

export default Content
