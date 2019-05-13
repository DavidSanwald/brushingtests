import { scaleLinear, scaleTime } from 'd3-scale'
import { useMemo } from 'react'

const time = ({ range, rangeRound, domain, nice = false, clamp = false }) => {
  const scale = scaleTime()
  scale.type = 'linear'

  if (range) scale.range(range)
  if (rangeRound) scale.rangeRound(rangeRound)
  if (domain) scale.domain(domain)
  if (nice) scale.nice()
  if (clamp) scale.clamp(true)

  return scale
}
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

export { linear, time }
