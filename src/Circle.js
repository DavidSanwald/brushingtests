import React, { useState, memo } from 'react'
import { useSpring, animated } from 'react-spring'

const Circle = ({
  x,
  y,
  size,
  color,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  onClick,
  ...restProps
}) => {
  const [state, setState] = useState(false)
  const [springProps, set] = useSpring(() => ({ cx: x, cy: y, r: size / 2 }))
  set({ cx: x, cy: y, r: size / 2 })

  return (
    <animated.circle
      onMouseOver={() => setState(true)}
      onMouseLeave={() => setState(false)}
      fill={color}
      onClick={onClick}
      {...restProps}
      {...springProps}
    />
  )
}
export default memo(Circle)
