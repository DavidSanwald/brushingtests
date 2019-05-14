import React, { useState, useEffect, useRef, useMemo } from 'react'
import Group from './Group'
import useDims from './useDims'
import { linear, padDomain } from './scales'
import { useExtent, getCoordinates, scalePoint } from './transformationHelpers'
import { compose, prop, applySpec, map, sort } from 'ramda'
import { isInside } from './helpers'
import { getRandomColor, colors } from './colors'
import { getData } from './dataGens'
import useBrush from './useBrush'
import localPoint from './localPoint'
import XAxis from './XAxis.js'
import YAxis from './YAxis.js'
import Circle from './Circle'
import chance from 'chance'
import Voronoi from './useVoronoi'

const width = 900
const height = 600
const xKey = 'x'
const yKey = 'y'

const data = getData(100, Math.random()).map(datum => ({
  ...datum,
  color: getRandomColor(),
  size: Math.random() * 70
}))
const chance1 = chance('1234')

function App() {
  const eventRef = useRef('')
  const { margin, innerHeight, innerWidth } = useDims(width, height)
  const xExtent = padDomain(useExtent('x', data))
  const yExtent = padDomain(useExtent('y', data))
  const [xDomain, setXDomain] = useState(xExtent)
  const [yDomain, setYDomain] = useState(yExtent)
  const xScale = useMemo(
    () => linear({ range: [0, innerWidth], domain: xDomain }),
    [xExtent, innerWidth, xDomain]
  )
  const yScale = useMemo(
    () => linear({ range: [innerHeight, 0], domain: yDomain }),
    [innerHeight, yExtent, yDomain]
  )
  console.log(yDomain)
  console.log(yScale.domain())
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
  const [area, status, events] = useBrush('drag')
  const rectArea = area
  const { top, bottom, left, right } = rectArea
  const isHighlighted = isInside(rectArea)
  const scaledData = data.map(datum => ({
    ...datum,
    x: xScale(datum.x),
    y: yScale(datum.y)
  }))
  useEffect(() => {
    console.log(xDomain)
    if (status === 'brushEnd') {
      setXDomain(
        map(
          x => x,
          sort((a, b) => a - b, [xScale.invert(left), xScale.invert(right)])
        )
      )
      setYDomain(
        map(
          y => y,
          sort((a, b) => a - b, [yScale.invert(bottom), yScale.invert(top)])
        )
      )
    }
  }, [status])

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
        <Voronoi width={innerWidth} height={innerHeight} data={scaledData} />
        {data.map((datum, i) => {
          const doHighlight = isHighlighted({
            x: datum.x,
            y: datum.y
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
