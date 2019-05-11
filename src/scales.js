import { scaleLinear } from 'd3-scale'
import { useMemo } from 'react'

const linear = ({ range, rangeRound, domain, nice = false, clamp = false }) => {
  const scale = scaleLinear()
  scale.type = 'linear'

  if (range) scale.range(range)
  if (rangeRound) scale.rangeRound(rangeRound)
  if (domain) scale.domain(domain)
  if (nice) scale.nice()
  if (clamp) scale.clamp(true)

  return scale
}

export { linear }
