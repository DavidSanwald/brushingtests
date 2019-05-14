import React from 'react'
import { voronoi } from 'd3-voronoi'
const Polygon = ({ poly, ...restProps }) => (
  <path d={`M${poly.join('L')}Z`} {...restProps} />
)
const Voronoi = ({ data, width, height, ...restProps }) => {
  const genVoronoi = voronoi()
    .x(d => d.x)
    .y(d => d.y)
    .extent([[0, 0], [width, height]])
  const polygons = genVoronoi.polygons(data)

  return (
    <>
      {polygons.map(poly => (
        <Polygon poly={poly} opacity={0} />
      ))}
    </>
  )
}

export default Voronoi
