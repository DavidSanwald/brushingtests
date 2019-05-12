const createPoint = ({ x, y }) => ({
  x,
  y,
  value () {
    return { x, y }
  }
})
export default function localPoint (node, event) {
  // called with no args
  if (!node) return

  // called with localPoint(event)
  if (node.target) {
    event = node

    // set node to targets owner svg
    node = event.target.ownerSVGElement

    // find the outermost svg
    while (node.ownerSVGElement) {
      node = node.ownerSVGElement
    }
  }

  // default to mouse event
  let { clientX, clientY } = event

  // support touch event
  if (event.changedTouches) {
    clientX = event.changedTouches[0].clientX
    clientY = event.changedTouches[0].clientY
  }

  // calculate coordinates from svg
  if (node.createSVGPoint) {
    let point = node.createSVGPoint()
    point.x = clientX
    point.y = clientY
    point = point.matrixTransform(node.getScreenCTM().inverse())
    return createPoint({
      point
    })
  }

  // fallback to calculating position from non-svg dom node
  const rect = node.getBoundingClientRect()
  return createPoint({
    x: clientX - rect.left - node.clientLeft,
    y: clientY - rect.top - node.clientTop
  })
}
