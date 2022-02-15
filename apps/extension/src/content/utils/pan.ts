import Vec from '@tldraw/vec'

/**
 * Normalizes the delta w.r.t to the window height and zoom level
 */
export const normalizeDelta = (delta: number[], zoom: number): number[] => {
  // Get the delta (taking into consideration the zoom level)
  const normalizedDelta = Vec.div(delta, zoom)

  // Disable horizontal panning (for now)
  normalizedDelta[0] = 0

  // Normalize delta value for vertical panning (y-axis)
  if (normalizedDelta[1] > 0) {
    // Get the maximum height that can be scrolled downwards
    const maxScrollYDelta = Math.floor(getScrollHeight() - window.innerHeight - window.scrollY)
    normalizedDelta[1] = Math.min(normalizedDelta[1], maxScrollYDelta)
  } else {
    // Get the maximum height that can be scrolled upwards
    const maxScrollYDelta = -1 * window.scrollY
    normalizedDelta[1] = Math.max(normalizedDelta[1], maxScrollYDelta)
  }
  return normalizedDelta
}

/**
 * @returns (scroll) height of the document
 */
const getScrollHeight = (): number => {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  )
}
