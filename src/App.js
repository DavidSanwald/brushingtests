import React, {
  useState,
  useReducer,
  useEffect,
  useRef,
  useCallback,
  useMemo
} from 'react'
import Group from './Group'
import useDims from './useDims'
import bubbleData from './bubbleData'
import { linear } from './scales'
import { keyExtent, useExtent } from './transformationHelpers'
import {
  compose,
  prop,
  applySpec,
  evolve,
  useWith,
  lte,
  map,
  where,
  ifElse,
  gte,
  both,
  gt,
  tap
} from 'ramda'
import { getRandomColor, colors } from './colors'
import { pred } from './helpers'
import { getData } from './dataGens'
import useBrush from './useBrush'
import localPoint from './localPoint'
import XAxis from './XAxis.js'
import YAxis from './YAxis.js'
import Circle from './Circle'
import chance from 'chance'

const peek = tap(x => console.log(x))

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
const data = getData(3, Math.random())
const chance1 = chance('1234')

function App() {
  const eventRef = useRef('')
  const { margin, innerHeight, innerWidth } = useDims(width, height)
  const xExtent = useExtent('x', data)
  const yExtent = useExtent('y', data)
  const xScale = useMemo(
    () => linear({ range: [0, innerWidth], domain: padDomain(xExtent) }),
    [xExtent, innerWidth]
  )
  const yScale = useMemo(
    () => linear({ range: [innerHeight, 0], domain: padDomain(yExtent) }),
    [innerHeight, yExtent]
  )
  const scaleArea = applySpec({
    top: compose(
      yScale.invert,
      prop('top')
    ),
    bottom: compose(
      yScale.invert,
      prop('bottom')
    ),
    left: compose(
      xScale.invert,
      prop('left')
    ),
    right: compose(
      xScale.invert,
      prop('right')
    )
  })
  const [state, events] = useBrush('drag')
  const { area, dragArea } = state
  console.log(state.currentStatus)
  const rectArea = state.currentStatus === 'dragging' ? dragArea : area
  const { top, bottom, left, right } = rectArea

  return (
    <svg width={width} height={height} pointerEvents="none">
      <Group top={margin.top} left={margin.left}>
        <rect
          pointerEvents="all"
          fill="black"
          opacity="0"
          height={innerHeight}
          width={innerWidth}
          ref={eventRef}
          onMouseMove={e =>
            events.onMouseMove(localPoint(eventRef.current, e.nativeEvent))
          }
          onMouseDown={e =>
            events.onMouseDown(localPoint(eventRef.current, e.nativeEvent))
          }
          onMouseUp={e => events.onMouseUp()}
        />
        <rect
          x={left}
          y={top}
          width={Math.max(0, right - left)}
          height={Math.max(0, bottom - top)}
          pointerEvents="none"
          fill={'none'}
          stroke="red"
          opacity={0.8}
        />
        {data.map((datum, i) => (
          <Circle
            key={i}
            x={xScale(datum.x)}
            y={yScale(datum.y)}
            size={45}
            opacity={0.8}
            fill={pred(scaleArea(state.area))(datum) ? 'black' : 'blue'}
            stroke="white"
            strokeWidth="2px"
          />
        ))}
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
