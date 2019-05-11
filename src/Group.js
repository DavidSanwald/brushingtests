import React, { memo } from 'react'
import cx from 'classnames'
const Group = ({
  top = 10,
  left = 64,
  transform,
  className,
  children,
  ...restProps
}) => {
  return (
    <g
      className={cx('vx-group', className)}
      transform={transform || `translate(${left}, ${top})`}
      {...restProps}>
      {children}
    </g>
  )
}

export default memo(Group)
