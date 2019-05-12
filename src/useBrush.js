import React, { useReducer, useState, useEffect } from 'react'
import { pred, isInside, inRange } from './helpers'
import { not, compose, sort } from 'ramda'
const initBrush = ({ x, y }) => ({
  left: x,
  right: x,
  top: y,
  bottom: y
})
const computeBrushArea = ({ startLocX, startLocY, x, y }) => {
  return {
    bottom: Math.max(startLocY, y),
    right: Math.max(startLocX, x),
    left: Math.min(startLocX, x),
    top: Math.min(startLocY, y)
  }
}
const computeDragArea = ({ x, y, startLocX, startLocY, dragArea }) => {
  console.log('dragArea')
  return {
    bottom: dragArea.bottom + (y - startLocY),
    left: dragArea.left + (x - startLocX),
    right: dragArea.right + (x - startLocX),
    top: dragArea.top + (y - startLocY)
  }
}
const dragReducer = (state, action) => {
  const {
    payload: { x, y },
    type
  } = action
  switch (type) {
    case 'onMouseDown':
      const {
        area: { left, right, top, bottom }
      } = state
      console.log(state.area)
      console.log('x: ', x)
      console.log('y:', y)
      const xRange = sort((a, b) => a - b, [left, right])
      const yRange = sort((a, b) => a - b, [top, bottom])

      const isInsideX = xRange[0] < x && x < xRange[1] + 0.00001
      const isInsideY = yRange[0] < y && y < yRange[1] + 0.00001
      const isOutSideAreaClick = !isInsideX || !isInsideY

      return {
        ...state,
        startLocX: x,
        startLocY: y,
        dragArea: isOutSideAreaClick ? null : state.area,
        currentStatus: isOutSideAreaClick ? 'brushing' : 'dragging'
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
            : state.area,
        dragArea:
          state.dragArea && state.currentStatus === 'dragging'
            ? computeDragArea({
                x,
                y,
                startLocX: state.startLocX,
                startLocY: state.startLocY,
                dragArea: state.area
              })
            : null
      }
    case 'onMouseUp':
      return {
        ...state,
        startLocX: 0,
        startLocY: 0,
        currentStatus: 'idle'
      }
    default:
      throw new Error()
  }
}

/* function reducer (state, action) {
  const { type, payload } = action
  switch (type) {
    case 'onMouseMove':
      const newArea = isOutSideAreaClick
        ? {
          top: payload.y,
          left: payload.x,
          right: payload.x,
          bottom: payload.y
        }
        : computeDragArea({
          currentLocX: payload.x,
          currentLocY: payload.y,
          startLocX: state.startLocX,
          startLocY: state.startLocY,
          area: state.area
        })
      console.log(payload)
      console.log(state.brushArea)
      console.log(isOutSideAreaClick)
      return {
        ...state,
        area: newArea,
        startLocX: payload.x,
        startLocY: payload.y,
        status: !isOutSideAreaClick && state.drag ? 'dragging' : 'brushing',
        buttonState: 'down'
      }
    case 'onMouseLeave':
      return {
        ...state,
        status: 'stopped',
        startLocX: 0,
        startLocY: 0,
        area:
          state.mode === 'dragging'
            ? state.area
            : { left: 0, right: 0, top: 0, bottom: 0 }
      }
    case 'onMouseUp':
      return {
        ...state,
        area:
          state.mode === 'drag'
            ? state.area
            : { left: 0, right: 0, top: 0, bottom: 0 },
        status: 'stopped',
        startLocX: 0,
        startLocY: 0,
        buttonState: 'up'
      }
    case 'onMouseDown':
      const { startLocX, startLocY } = state
      const isOutSideAreaClick = !pred(state.area)(payload)
      const { x: currentLocX, y: currentLocY } = payload
      const newStatus =
      return {
        ...state,
        status: newStatus,
        startLocX: 'brushStart' ? payload.x : 0,
        startLocY: 'brushStart' ? payload.y : 0,
        area:
          newStatus === 'dragging'
            ? computeDragArea({
              startLocX: state.startLocX,
              startLocY: state.startLocY,
              currentLocX: payload.x,
              currentLocY: payload.y
            })
            : {
              left: payload.x,
              right: payload.x,
              top: payload.y,
              bottom: payload.y
            }
      }
    default:
      throw Error()
  } */
const initState = mode => ({
  area: { top: 0, right: 0, bottom: 0, left: 0 },
  dragArea: false,
  startLocX: 0,
  startLocY: 0,
  currentStatus: 'idle'
})

const useBrush = (mode = 'drag') => {
  const [state, dispatch] = useReducer(dragReducer, initState(mode))
  const onMouseUp = () => dispatch({ type: 'onMouseUp', payload: {} })
  const onMouseMove = ({ x, y }) =>
    dispatch({ type: 'onMouseMove', payload: { x, y } })
  const onMouseDown = ({ x, y }) => {
    dispatch({ type: 'onMouseDown', payload: { x, y } })
  }
  const onMouseLeave = ({ x, y }) =>
    dispatch({ type: 'onMouseLeave', payload: {} })
  const { area } = state
  return [state, { onMouseDown, onMouseUp, onMouseMove }]
}
export default useBrush
