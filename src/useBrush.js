import React, { useReducer } from 'react'
import { sort, cond, equals, always, or, anyPass, identity, map } from 'ramda'
import { isInside } from './helpers'
const initBrush = ({ x, y }) => ({
  left: x,
  right: x,
  top: y,
  bottom: y
})
const onMoveChange = cond([
  [equals('brushStart'), always('brushing')],
  [equals('dragStart'), always('dragging')],
  [
    anyPass([
      map(equals, ['dragging', 'dragEnd', 'brushing', 'brushEnd']),
      identity
    ]),
    identity
  ]
])
const computeBrushArea = ({ startLocX, startLocY, x, y }) => {
  return {
    bottom: Math.max(startLocY, y),
    right: Math.max(startLocX, x),
    left: Math.min(startLocX, x),
    top: Math.min(startLocY, y)
  }
}

const brushReducer = (state, action) => {
  const {
    payload: { x, y },
    type
  } = action
  switch (type) {
    case 'onMouseDown':
      const {
        area: { left, right, top, bottom }
      } = state

      return {
        ...state,
        startLocX: x,
        startLocY: y,
        currentStatus: 'brushStart'
      }
    case 'onMouseMove':
      return {
        ...state,
        area:
          state.currentStatus === 'brushing'
            ? computeBrushArea({
              startLocX: state.startLocX,
              startLocY: state.startLocY,
              x,
              y,
              area: state.area
            })
            : { top: 0, bottom: 0, right: 0, left: 0 },
        currentStatus:
          state.currentStatus === 'brushStart'
            ? 'brushing'
            : state.currentStatus
      }
    case 'onMouseUp':
      return {
        ...state,
        currentStatus: 'brushEnd'
      }
    case 'onMouseLeave':
      return {
        ...state,
        currentStatus: 'brushEnd'
      }
    default:
      throw new Error()
  }
}
const initState = () => ({
  area: { top: 0, right: 0, bottom: 0, left: 0 },
  startLocX: 0,
  startLocY: 0,
  currentStatus: 'idle'
})

const useBrush = () => {
  const [state, dispatch] = useReducer(brushReducer, initState())
  const onMouseUp = () => dispatch({ type: 'onMouseUp', payload: {} })
  const onMouseMove = ({ x, y }) =>
    dispatch({ type: 'onMouseMove', payload: { x, y } })
  const onMouseDown = ({ x, y }) => {
    dispatch({ type: 'onMouseDown', payload: { x, y } })
  }
  const onMouseLeave = ({ x, y }) =>
    dispatch({ type: 'onMouseLeave', payload: {} })
  const { area, currentStatus } = state
  return [area, currentStatus, { onMouseDown, onMouseUp, onMouseMove }]
}
export default useBrush
