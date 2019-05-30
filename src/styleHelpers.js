export const boxShadow = (elevation = 0, color = 'rgba(0, 0, 0, 0.1)') => {
  const blur1 = 2
  const offset1 = 0
  const x1 = 0
  const y1 = blur1 / 2

  const blur2 = (blur1 + 1) * Math.abs(elevation)
  const offset2 = (offset1 + 0.25) * Math.abs(elevation)
  const x2 = 0
  const y2 = (y1 + 0.5) * elevation

  const blur3 = blur2 + 1
  const offset3 = offset2 + 0.25
  const x3 = 0
  const y3 = y2 + 0.5

  const shadow1 = `${x1}px ${y1}px ${blur1}px ${offset1}px ${color}`
  const shadow2 = `${x2}px ${y2}px ${blur2}px ${offset2}px ${color}`
  const shadow3 = `${x3}px ${y3}px ${blur3}px ${offset3}px ${color}`

  return `${shadow1}, ${shadow2}, ${shadow3};`
}
