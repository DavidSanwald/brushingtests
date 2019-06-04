import React, { useState, useRef, useMemo } from 'react'
import 'styled-components/macro'
import { Box, Flex, Card } from 'rebass'
import { linear } from './scales'
import Group from './Group'
import useDims from './useDims'
import { boxShadow } from './styleHelpers'
import { useExtent } from './transformationHelpers'
import { compose, prop, applySpec, evolve } from 'ramda'
import { isInside } from './helpers'
import { getRandomColor, colors } from './colors'
import { pred } from './helpers'
import styled from 'styled-components'
import useDragBrush from './useDragBrush'
import localPoint from './localPoint'
import XAxis from './Axis/XAxis'
import YAxis from './Axis/YAxis'
import Circle from './Circle'
import Bars from './Bars'

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

function Chart ({ data }) {
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
  const [state, events] = useDragBrush('')
  const { area, dragArea } = state
  const rectArea = state.currentStatus === 'dragging' ? dragArea : area
  const { top, bottom, left, right } = rectArea
  const isHighlighted = isInside(rectArea)
  const highlightedData = data.filter(datum => {
    return !isHighlighted({
      x: xScale(datum.x),
      y: yScale(datum.y)
    })
  })

  return (
    <Flex flexWrap='wrap' alignItems='center' css={{ maxHeight: '80vh' }}>
      <Box p={4} width={[1, 2 / 3, null, 1 / 2]}>
        <Card
          css={{ minHeight: '600px' }}
          boxShadow={boxShadow(3)}
          width={[900]}
          mx='auto'
          p={2}
          variant='basic'>
          <svg width={width} height={height} pointerEvents='none'>
            <Group top={margin.top} left={margin.left}>
              <rect
                pointerEvents='all'
                fill='black'
                opacity='0'
                height={innerHeight}
                width={innerWidth}
                ref={eventRef}
                onMouseMove={e =>
                  events.onMouseMove(
                    localPoint(eventRef.current, e.nativeEvent)
                  )
                }
                onMouseDown={e =>
                  events.onMouseDown(
                    localPoint(eventRef.current, e.nativeEvent)
                  )
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
                    size={doHighlight ? datum.size : datum.size * 4}
                    fillOpacity={doHighlight ? 0.2 : 0.6}
                    fill={doHighlight ? 'black' : colors[datum.kind]}
                    stroke='black'
                    strokeWidth='2px'
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
                pointerEvents='none'
                fill='black'
                stroke='black'
                fillOpacity={0.02}
              />
            </Group>
          </svg>
        </Card>
      </Box>
      <Flex p={4} ml='auto' width={[1 / 4]} minHeight={[900]} />
    </Flex>
  )
}

export default Chart
