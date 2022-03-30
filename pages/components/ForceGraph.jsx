import dynamic from 'next/dynamic'
import { ForceGraph2D } from 'react-force-graph'

const WrappedForceGraph = ({fgRef, ...props}) => {
  return <ForceGraph2D {...props} ref={fgRef}></ForceGraph2D>
}

export default WrappedForceGraph