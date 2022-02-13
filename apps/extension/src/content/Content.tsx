import React from 'react'
import { Tldraw, TldrawApp } from '@tldrawe/tldraw'
import Vec from '@tldraw/vec'
import type { TLWheelEventHandler } from '@tldraw/core'
import isHotkey from 'is-hotkey'
import browser from 'webextension-polyfill'

const TOGGLE_OVERLAY = 'mod+shift+o'

const Content = () => {
  const [tldraw, setTldraw] = React.useState<TldrawApp>()
  const [showOverlay, setShowOverlay] = React.useState<boolean>(false)

  const onMount = React.useCallback((app: TldrawApp) => {
    app.pausePan() // Turn off the app's pan handling
    app.pauseZoom() // Turn off the app's zoom handling
    setTldraw(app)
  }, [])

  const onPan: TLWheelEventHandler = React.useCallback(
    (info, e) => {
      if (!tldraw) return

      if (tldraw.appState.status === 'pinching') return

      const delta = Vec.div(info.delta, tldraw.pageState.camera.zoom)

      // Disable horizontal panning
      // TODO: Enable horizontal panning so that the canvas pans horizontally accordingly as the user scrolls horizontally
      delta[0] = 0

      // get the height of the document
      const scrollHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      )

      // Normalize delta value for vertical panning (y-axis)
      if (delta[1] < 0) {
        delta[1] = Math.max(delta[1], -1 * window.pageYOffset)
      } else {
        delta[1] = Math.min(delta[1], scrollHeight - window.innerHeight - window.pageYOffset)
      }

      const prev = tldraw.pageState.camera.point
      const next = Vec.sub(prev, delta)

      if (Vec.isEqual(next, prev)) return

      window.scrollBy(0, delta[1])

      tldraw.pan(delta)
    },
    [tldraw]
  )

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
    const onReceiveToggle = (message: any) => {
      if (message.toggle) {
        setShowOverlay((showOverlay) => !showOverlay)
      }
    }

    browser.runtime.onMessage.addListener(onReceiveToggle)

    return () => {
      browser.runtime.onMessage.removeListener(onReceiveToggle)
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
            showMenu={false}
            showSponsorLink={false}
            showZoom={false}
            showPages={false}
          />
        </div>
      )}
    </>
  )
}

export default Content
