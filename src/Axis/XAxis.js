import React, { useMemo, memo } from 'react'
import { AxisBottom } from '@vx/axis'

function numTicksForWidth (width) {
  if (width <= 300) return 2
  if (width > 300 && width <= 400) return 5
  return 10
}
export const getAxisStyles = () => {
  return {
    stroke: '#e6e6e9',
    tickStroke: ' #e6e6e9'
  }
}

export const getLabelProps = () => {
  return {
    fill: '#6b6b76'
  }
}

const getTickLabelProps = () => {
  return {
    fill: '#6b6b76',
    fontSize: '12px'
  }
}

const labelProps = {
  fill: '#6b6b76',
  stroke: 'none'
}

const defaultTickLabelProps = {
  fill: '#6b6b76',
  fontSize: '12',
  strokeWidth: '1px',
  dy: '0.25em',
  textAnchor: 'middle'
}
const axisProps = {
  tickStroke: 'none',
  fill: '#6b6b76',
  strokeWidth: '2px'
}
const XAxis = ({ xScale, innerWidth, innerHeight, margin }) => {
  return (
    <AxisBottom
      {...getAxisStyles()}
      labelProps={getLabelProps()}
      scale={xScale}
      top={innerHeight}
      numTicks={numTicksForWidth(innerWidth)}
      tickLabelProps={(value, index) => defaultTickLabelProps}
    />
  )
}

export default memo(XAxis)
