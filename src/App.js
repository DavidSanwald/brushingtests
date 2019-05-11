import React, { useState, useReducer, useEffect, useRef } from 'react'
import Group from './Group'
import { map } from 'ramda'
import useDims from './useDims'
import bubbleData from './bubbleData'
import { linear } from './scales'
import { keyExtent, useExtent } from './transformationHelpers'
import { compose, prop, applySpec, evolve } from 'ramda'
import { getRandomColor } from './colors'
import { getData } from './dataGens'
import localPoint from './localPoint'
import XAxis from './XAxis.js'
import YAxis from './YAxis.js'
import Circle from './Circle'

const width = 900
const height = 600
const xKey = 'x'
const yKey = 'y'

const getCoordinates = (xKey, yKey) =>
  applySpec({
    projection: {
      x: prop(xKey),
      y: prop(yKey)
    }
  })

const scalePoint = (xScale, yScale) =>
  evolve({
    projection: {
      x: xScale,
      y: yScale
    }
  })

const padDomain = domain => {
  const [lower, upper] = domain
  const diff = upper - lower
  const pad = diff * 0.05
  return [lower - pad, upper + pad]
}
const useData = (generator, number = 20) => {
  const [data, setData] = useState(() => generator(number, Math.random()))
  const genData = () => setData(generator(number, Math.random()))
  return [data, genData]
}
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
function reducer(state, action) {
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
        isBrushing: true
      }
    case 'brushStop':
      return { ...state, isBrushing: false, startLocX: 0, startLocY: 0 }
    case 'brushing':
      const { startLocX, startLocY } = state
      const { x: currentLocX, y: currentLocY } = payload
      return {
        ...state,
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
const initState = {
  brushArea: { top: 0, right: 0, bottom: 0, left: 0 },
  startLocX: 0,
  startLocY: 0,
  isBrushing: false
}

const useBrush = node => {
  const [state, dispatch] = useReducer(reducer, initState)

  const onMouseDown = e => {
    e.persist()
    const { x, y } = localPoint(node, e).value()
    dispatch({
      type: 'brushStart',
      payload: {
        x,
        y
      }
    })
  }
  const onMouseLeave = e => {
    dispatch({
      type: 'brushStop'
    })
  }
  const onMouseUp = e => {
    dispatch({
      type: 'brushStop'
    })
  }

  const onMouseMove = e => {
    e.persist()
    const { x, y } = localPoint(node, e).value()
    dispatch({
      type: 'brushing',
      payload: {
        x,
        y
      }
    })
  }

  const {
    brushArea: { top, right, left, bottom },
    isBrushing
  } = state

  const myRect = isBrushing ? (
    <rect
      x={left}
      y={top}
      width={Math.max(right - left)}
      height={Math.max(0, bottom - top)}
      pointerEvents="none"
      fill={'red'}
    />
  ) : null
  const events = { onMouseDown, onMouseUp, onMouseMove, onMouseLeave }
  return [myRect, events]
}

function App() {
  const eventRef = useRef('')
  const { margin, innerHeight, innerWidth } = useDims(width, height)
  const [data, genData] = useData(getData, 100)
  const xExtent = useExtent('x', data)
  const yExtent = useExtent('y', data)
  const xScale = linear({ range: [0, innerWidth], domain: padDomain(xExtent) })
  const yScale = linear({ range: [innerHeight, 0], domain: padDomain(yExtent) })
  const [brush, events] = useBrush(eventRef.current)

  return (
    <svg width={width} height={height} pointerEvents="none">
      <Group top={margin.top} left={margin.left}>
        <rect
          pointerEvents="all"
          fill="black"
          opacity="0"
          height={innerHeight}
          width={innerWidth}
          {...events}
          ref={eventRef}
        />
        {data.map((datum, i) => (
          <Circle
            {...datum}
            key={i}
            x={xScale(datum.x)}
            y={yScale(datum.y)}
            size={35}
            opacity={0.8}
            fill={'black'}
            stroke="white"
          />
        ))}
        {brush}
        <XAxis
          xScale={xScale}
          innerWidth={innerWidth}
          innerHeight={innerHeight}
          margin={margin}
        />
        <YAxis
          yScale={yScale}
          innerWidth={innerWidth}
          innerHeight={innerHeight}
          margin={margin}
        />
      </Group>
    </svg>
  )
}

export default App
