import React, { useMemo } from 'react'
import { line as d3Line, curveCatmullRom } from 'd3-shape'
export const useLineGenerator = ({ curve }) => {
  return useMemo(
    () =>
      d3Line()
        .defined(d => d.x !== null && d.y !== null)
        .x(d => d.x)
        .y(d => d.y)
        .curve(curveCatmullRom),
    [curve]
  )
}
