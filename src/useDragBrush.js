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
const computeDragArea = ({ x, y, startLocX, startLocY, dragArea }) => {
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
      const isOutSideAreaClick = isInside(state.area, { x, y })

      let newStatus = isOutSideAreaClick ? 'brushStart' : 'dragStart'

      return {
        ...state,
        startLocX: x,
        startLocY: y,
        currentStatus: newStatus,
        area: isOutSideAreaClick ? initBrush({ x, y }) : state.area,
        dragArea: isOutSideAreaClick ? null : state.area
      }
    case 'onMouseMove':
      const nextStatus = onMoveChange(state.currentStatus)
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
          (state.dragArea && state.currentStatus === 'dragging') ||
          state.currentStatus === 'dragStart'
            ? computeDragArea({
              x,
              y,
              startLocX: state.startLocX,
              startLocY: state.startLocY,
              dragArea: state.area
            })
            : null,
        currentStatus: nextStatus
      }
    case 'onMouseUp':
      return {
        ...state,
        area: state.currentStatus === 'dragging' ? state.dragArea : state.area,
        currentStatus:
          state.currentStatus === 'dragging'
            ? 'dragEnd'
            : state.currentStatus === 'brushing'
              ? 'brushEnd'
              : state.currentStatus
      }
    case 'onMouseLeave':
      return {
        ...state,
        currentStatus: cond([
          [or(equals('brushEnd'), equals('dragEnd')), identity],
          [equals('brushing'), always('brushEnd')],
          [equals('dragging'), always('dragend')]
        ])(state.currentStatus)
      }
    default:
      throw new Error()
  }
}

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
