import React, { memo } from 'react'
import { AxisLeft } from '@vx/axis'

function numTicksForHeight(height) {
  if (height <= 300) return 3
  if (height > 300 && height <= 600) return 5
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

export const getTickLabelProps = (value, num) => {
  return {
    fill: '#6b6b76',
    fontSize: '12px',
    dx: '-2.75em',
    dy: '0.25em'
  }
}

const YAxis = ({ yScale, innerWidth, innerHeight, ...restProps }) => {
  return (
    <AxisLeft
      {...restProps}
      scale={yScale}
      labelProps={getLabelProps()}
      {...getAxisStyles()}
    />
  )
}

export default memo(YAxis)
