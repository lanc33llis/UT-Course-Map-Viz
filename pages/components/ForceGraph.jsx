import { ForceGraph2D } from 'react-force-graph'

const getColor = id => `#${((id * 34563453) % Math.pow(2, 24)).toString(16).padStart(6, '0')}`

const ForceGraph = ({ data, fgRef}) => {
  return <ForceGraph2D
    ref={fgRef}
    graphData={data}
    backgroundColor={'#f0f0f0'}
    linkWidth={2}
    linkDirectionalArrowLength={10}
    linkDirectionalArrowRelPos={0.9}
    nodeAutoColorBy="group"
    nodeLabel={node => node.actual}
    nodeCanvasObject={(node, ctx, globalScale) => {
      // draw a circle with a stroke
      ctx.fillStyle = getColor(node.group)
      ctx.beginPath()
      ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI)
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 1
      ctx.stroke()

      // draw the label
      ctx.font = '10px sans-serif'
      ctx.fillStyle = '#fff'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = "black"
      ctx.fillText(node.id, node.x + 25, node.y - 10)
    }}
  />
}

export default ForceGraph