import React, { useState, memo } from 'react'
import { useSpring, animated } from 'react-spring'
import { pick } from 'ramda'

const Circle = ({ x, y, size, fill, ...restProps }) => {
  const [springProps, set] = useSpring(() => ({ cx: x, cy: y, r: size / 2 }))
  set({ cx: x, cy: y, r: size / 2 })
 
  return <animated.circle fill={fill} {...restProps} {...springProps} />
}
export default memo(Circle)
