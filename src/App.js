import React, {
  useState,
  useReducer,
  useEffect,
  useRef,
  useCallback,
  useMemo
} from 'react'
import { linear, time } from './scales'
import Group from './Group'
import useDims from './useDims'
import { keyExtent, useExtent } from './transformationHelpers'
import {
  compose,
  prop,
  assoc,
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
  tap,
  pluck
} from 'ramda'
import { isInside } from './helpers'
import { getRandomColor, colors } from './colors'
import { pred } from './helpers'
import { getData } from './data/dataGens'
import generateStreamData from './data/streamGraphData'
import useBrush from './useBrush'
import localPoint from './localPoint'
import XAxis from './Axis/XAxis'
import YAxis from './Axis/YAxis'
import Circle from './Circle'
import chance from 'chance'
import { stack, area } from 'd3-shape'

const myArea = area()
  .x(d => d.date)
  .y0(d => 0)
  .y1(d => d.count)

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
const data = getData(100, Math.random()).map(datum => ({
  ...datum,
  color: getRandomColor(),
  size: Math.random() * 70
}))
console.log(data)
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
  const scalePoint = useMemo(
    () => (xScale, yScale) => applySpec({ x: xScale.invert, y: yScale.invert }),
    [xScale, yScale]
  )
  const [state, events] = useBrush('drag')
  const { area, dragArea } = state
  const rectArea = state.currentStatus === 'dragging' ? dragArea : area
  const { top, bottom, left, right } = rectArea
  const isHighlighted = isInside(rectArea)

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
        {data.map((datum, i) => {
          const doHighlight = isHighlighted({
            x: xScale(datum.x),
            y: yScale(datum.y)
          })
          return (
            <Circle
              key={i}
              x={xScale(datum.x)}
              y={yScale(datum.y)}
              size={doHighlight ? datum.size / 4 : datum.size}
              fillOpacity={doHighlight ? 0.2 : 0.6}
              fill={doHighlight ? 'black' : datum.color}
              stroke="black"
              strokeWidth="2px"
            />
          )
        })}
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
        <rect
          x={left}
          y={top}
          width={Math.min(Math.max(0, right - left), innerWidth)}
          height={Math.min(Math.max(0, bottom - top), innerHeight)}
          pointerEvents="none"
          fill="black"
          stroke="black"
          fillOpacity={0.02}
        />
      </Group>
    </svg>
  )
}

export default App
