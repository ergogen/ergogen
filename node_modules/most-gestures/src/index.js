const { fromEvent, merge } = require('most')
const { normalizeWheel, preventDefault } = require('./utils')
const { presses } = require('./presses')
const { taps } = require('./taps')
const { drags } = require('./drags')
const { zooms } = require('./zooms')

function baseInteractionsFromEvents (targetEl, options) {
  const defaults = {
    preventScroll: true
  }
  options = Object.assign({}, defaults, options)

  const mouseDowns$ = fromEvent('mousedown', targetEl)
  const mouseUps$ = fromEvent('mouseup', targetEl)
  // const mouseLeaves$ = fromEvent('mouseleave', targetEl).merge(fromEvent('mouseout', targetEl))
  const mouseMoves$ = fromEvent('mousemove', targetEl) // .takeUntil(mouseLeaves$) // altMouseMoves(fromEvent(targetEl, 'mousemove')).takeUntil(mouseLeaves$)
  const rightClicks$ = fromEvent('contextmenu', targetEl).tap(preventDefault) // disable the context menu / right click

  const touchStarts$ = fromEvent('touchstart', targetEl)
  const touchMoves$ = fromEvent('touchmove', targetEl)
  const touchEnds$ = fromEvent('touchend', targetEl)

  // const gestureChange$ = fromEvent('gesturechange', targetEl)
  // const gestureStart$ = fromEvent('gesturestart', targetEl)
  // const gestureEnd$ = fromEvent('gestureend', targetEl)

  const pointerDowns$ = merge(mouseDowns$, touchStarts$) // mouse & touch interactions starts
  const pointerUps$ = merge(mouseUps$, touchEnds$) // mouse & touch interactions ends
  const pointerMoves$ = merge(mouseMoves$, touchMoves$.filter(t => t.touches.length === 1))

  function preventScroll (targetEl) {
    fromEvent('mousewheel', targetEl).forEach(preventDefault)
    fromEvent('DOMMouseScroll', targetEl).forEach(preventDefault)
    fromEvent('wheel', targetEl).forEach(preventDefault)
    fromEvent('touchmove', targetEl).forEach(preventDefault)
  }

  if (options.preventScroll) {
    preventScroll(targetEl)
  }

  const wheel$ = merge(
    fromEvent('wheel', targetEl),
    fromEvent('DOMMouseScroll', targetEl),
    fromEvent('mousewheel', targetEl)
  ).map(normalizeWheel)

  return {
    mouseDowns$,
    mouseUps$,
    mouseMoves$,

    rightClicks$,
    wheel$,

    touchStarts$,
    touchMoves$,
    touchEnds$,

    pointerDowns$,
    pointerUps$,
    pointerMoves$}
}

function pointerGestures (input, options) {
  let baseInteractions = 'addEventListener' in input ? baseInteractionsFromEvents(input, options) : input

  const defaults = {
    multiTapDelay: 250, // delay between clicks/taps
    longPressDelay: 250, // delay after which we have a 'hold'
    maxStaticDeltaSqr: 100, // maximum delta (in pixels squared) above which we are not static
    zoomMultiplier: 200, // zoomFactor for normalized interactions across browsers
    pinchThreshold: 4000, // The minimum amount in pixels the inputs must move until it is fired.
    pixelRatio: (typeof window !== 'undefined' && window.devicePixelRatio) ? window.devicePixelRatio : 1
  }
  const settings = Object.assign({}, defaults, options)

  const press$ = presses(baseInteractions, settings)
  const holds$ = press$ // longTaps/holds: either HELD leftmouse/pointer or HELD right click
    .filter(e => e.timeDelta > settings.longPressDelay)
    .filter(e => e.moveDelta.sqrd < settings.maxStaticDeltaSqr) // when the square distance is bigger than this, it is a movement, not a tap
    // .map(e => e.value)
  const taps$ = taps(press$, settings)
  const drags$ = drags(baseInteractions, settings)
  const zooms$ = zooms(baseInteractions, settings)

  // FIXME: use 'press' as higher level above tap & click

  return {
    press: press$,
    holds: holds$,
    taps: taps$,
    drags: drags$,
    zooms: zooms$
  }
}

module.exports = {baseInteractionsFromEvents, pointerGestures}
