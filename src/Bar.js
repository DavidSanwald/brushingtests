import React, { useState, memo } from 'react'
import { useSpring, animated, config, useTransition } from 'react-spring'
import { pick } from 'ramda'

const Bar = ({
  x,
  y,
  width,
  fill,
  height,
  fromY,
  fromHeight,
  ...restProps
}) => {
  const [springProps, set] = useSpring(() => ({
    height: fromHeight,
    y: fromY
  }))
  set({ height, y })

  return (
    <animated.rect
      {...restProps}
      fill={fill}
      x={x}
      width={width}
      y={y}
      height={height}
      {...springProps}
    />
  )
}
export default memo(Bar)
