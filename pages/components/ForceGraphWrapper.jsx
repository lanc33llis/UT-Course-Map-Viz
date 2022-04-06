import dynamic from 'next/dynamic'
import { forwardRef } from 'react'

const ForceGraph = dynamic(() => import("./ForceGraph"), {
  ssr: false
})

const frForceGraph = forwardRef((props, ref) => {
  return <ForceGraph fgRef={ref} {...props} />
})
frForceGraph.displayName = "ForceGraph"

export default frForceGraph