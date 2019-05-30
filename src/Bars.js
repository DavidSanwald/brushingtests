import React, { memo, useMemo } from 'react'
import { scaleBand } from 'd3-scale'
import styled from 'styled-components'
import useDims from './useDims'
import { getRandomColor, colors } from './colors'
import { useTransition, animated } from 'react-spring'
import {
  compose,
  prop,
  reduce,
  add,
  reduceBy,
  toPairs,
  chain,
  curry,
  map
} from 'ramda'
import { linear } from './scales'
import Bar from './Bar'
import Group from './Group'
const width = 400
const height = 400
const defaultValues = reduce(
  (acc, curr) => {
    acc[curr] = 0
    return acc
  },
  {},
  colors
)
const valueFn = (acc, { size }) => add(acc, size)

const getKind = datum => colors[datum.kind]
const BarSeries = ({ data }) => {
  const { margin, innerHeight, innerWidth } = useDims(width, height)
  const test = { ...defaultValues, ...reduceBy(valueFn, 0, getKind, data) }
  const myData = toPairs(test).map(pair => ({ color: pair[0], value: pair[1] }))
  const yExtent = [0, 30]
  const yScale = useMemo(
    () => linear({ range: [innerHeight, 0], domain: yExtent }),
    [innerHeight, yExtent]
  )
  const xBandScale = scaleBand()
    .domain(colors)
    .range([0, innerWidth])
    .padding(0.1)
  console.log(myData)
  return (
    <svg width={width} height={height}>
      <Group top={margin.top} left={margin.left}>
        {myData.map((d, i) => {
          return (
            <Bar
              fromY={yScale(0)}
              fromHeight={innerHeight - yScale(0)}
              key={d.color}
              x={xBandScale(d.color)}
              y={yScale(d.value)}
              height={innerHeight - yScale(d.value)}
              width={xBandScale.bandwidth()}
              fill={d.color}
            />
          )
        })}
      </Group>
    </svg>
  )
}
export default BarSeries
