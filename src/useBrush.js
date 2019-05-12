import React, { useReducer, useState, useEffect } from 'react'
import { isInside } from './helpers'
const getBrushArea = ({
  startLocX,
  startLocY,
  currentLocX,
  currentLocY,
  brushArea
}) => {
  return {
    bottom: Math.max(startLocY, currentLocY),
    right: Math.max(startLocX, currentLocX),
    left: Math.min(startLocX, currentLocX),
    top: Math.min(currentLocY, startLocY)
  }
}
function reducer (state, action) {
  const { type, payload } = action
  switch (type) {
    case 'brushStart':
      const brushArea = {
        top: payload.y,
        left: payload.x,
        right: payload.x,
        bottom: payload.y
      }
      return {
        ...state,
        brushArea,
        startLocX: payload.x,
        startLocY: payload.y,
        status: 'brushing'
      }
    case 'brushEnd':
      return {
        ...state,
        status: 'stopped',
        startLocX: 0,
        startLocY: 0
      }
    case 'brushing':
      const { startLocX, startLocY } = state
      const { x: currentLocX, y: currentLocY } = payload
      return {
        ...state,
        status: 'brushing',
        brushArea: getBrushArea({
          brushArea: state.brushArea,
          startLocX,
          startLocY,
          currentLocX,
          currentLocY
        })
      }
    default:
      throw Error()
  }
}
const initState = drag => ({
  brushArea: { top: 0, right: 0, bottom: 0, left: 0 },
  startLocX: 0,
  startLocY: 0,
  status: 'stopped',
  drag
})

const useBrush = (node, drag) => {
  const [state, dispatch] = useReducer(reducer, initState(drag))
  const onMouseUp = () => dispatch({ type: 'brushEnd' })
  const onMouseMove = ({ x, y }) =>
    dispatch({ type: 'brushing', payload: { x, y } })
  const onMouseDown = ({ x, y }) =>
    dispatch({ type: 'brushStart', payload: { x, y } })
  const onMouseLeave = ({ x, y }) =>
    dispatch({ type: 'brushEnd', payload: { x, y } })
  return [
    dispatch,
    state.brushArea,
    state.status,
    { onMouseDown, onMouseUp, onMouseMove }
  ]
}
export default useBrush
