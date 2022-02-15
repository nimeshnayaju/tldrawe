import React from 'react'
import { TDDocument, TldrawApp } from '@tldrawe/tldraw'
import { TLWheelEventHandler } from '@tldraw/core'
import Vec from '@tldraw/vec'
import { normalizeDelta } from '../utils'
import browser from 'webextension-polyfill'

const SESSION_STORAGE_KEY = 'tldraw'

export function usePan() {
  const [tldraw, setTldraw] = React.useState<TldrawApp>()
  const [zoom, setZoom] = React.useState<number>(1)
  const isPanning = React.useRef<boolean>(false)
  const yOffset = React.useRef<number>(window.scrollY)

  /**
   * Request for the page zoom info on mount
   */
  React.useEffect(() => {
    browser.runtime
      .sendMessage({
        type: 'zoom',
      })
      .then((result: any) => {
        setZoom(result as number)
      })
      .catch((err) => {
        console.warn(err)
      })
  }, [])

  const onMount = React.useCallback((app: TldrawApp) => {
    app.pausePan() // Turn off the app's pan handling
    app.pauseZoom() // Turn off the app's zoom handling

    const existingDocument = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (existingDocument) {
      app.loadDocument(JSON.parse(existingDocument) as TDDocument)
    }
    // reset camera on mount and pan camera to the y-offset of the page
    app.resetCamera()
    app.pan([0, window.scrollY])
    setTldraw(app)
  }, [])

  /**
   * A callback to handle window scrolling when the canvas camera is
   */
  const onPan: TLWheelEventHandler = React.useCallback(
    (info, e) => {
      if (!tldraw) return

      if (tldraw.appState.status === 'pinching') return

      const normalizedDelta = normalizeDelta(info.delta, zoom)

      const prev = tldraw.pageState.camera.point
      const next = Vec.sub(prev, normalizedDelta)

      if (Vec.isEqual(next, prev)) return

      isPanning.current = true
      window.scrollBy(0, normalizedDelta[1])

      tldraw.pan(normalizedDelta)
    },
    [tldraw, zoom]
  )

  /**
   * Update the session storage value when the tldraw page changes
   */
  const onChangePage = React.useCallback(
    (app: TldrawApp) => {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(app.document))
    },
    [SESSION_STORAGE_KEY]
  )

  const onScrollHandler = React.useCallback(
    (e: Event) => {
      const yDelta = window.scrollY - yOffset.current
      yOffset.current = window.scrollY
      // if the scroll event was triggered programmatically, i.e., as a result of panning the canvas,
      // no need to deal with it
      if (isPanning.current) {
        isPanning.current = false
        return
      }
      if (tldraw) {
        tldraw.pan([0, yDelta])
      }
    },
    [tldraw]
  )

  /**
   * Register an event listener to listen to user generated scroll events
   */
  React.useEffect(() => {
    window.addEventListener('scroll', onScrollHandler)

    return () => {
      window.removeEventListener('scroll', onScrollHandler)
    }
  }, [onScrollHandler])

  return {
    setZoom,
    onMount,
    onPan,
    onChangePage,
  }
}
