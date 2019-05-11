import { sample } from 'lodash'
const colors = [
  '#ffd700',
  '#ffb14e',
  '#fa8775',
  '#ea5f94',
  '#cd34b5',
  '#9d02d7',
  '#0000ff'
]

const getRandomColor = () => sample(colors)
export { colors, getRandomColor }
