import React from 'react'
import { TDDocument, TldrawApp } from '@tldrawe/tldraw'
import { TLWheelEventHandler } from '@tldraw/core'
import Vec from '@tldraw/vec'

const SESSION_STORAGE_KEY = 'tldraw'

export function usePan() {
  const [tldraw, setTldraw] = React.useState<TldrawApp>()

  const onMount = React.useCallback((app: TldrawApp) => {
    app.pausePan() // Turn off the app's pan handling
    app.pauseZoom() // Turn off the app's zoom handling

    const existingDocument = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (existingDocument) {
      app.loadDocument(JSON.parse(existingDocument) as TDDocument)
    }
    // reset camera on mount and pan camera to the y-offset of the page
    app.resetCamera()
    app.pan([0, window.pageYOffset])
    setTldraw(app)
  }, [])

  /**
   * A callback to handle window scrolling when the canvas camera is
   */
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
   * Update the session storage value when the tldraw page changes
   */
  const onChangePage = React.useCallback(
    (app: TldrawApp) => {
      console.log('changing')
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(app.document))
    },
    [SESSION_STORAGE_KEY]
  )

  return {
    onMount,
    onPan,
    onChangePage,
  }
}
