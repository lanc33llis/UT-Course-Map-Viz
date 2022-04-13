import styles from '../styles/Index.module.sass'
import * as j from './common/test.json'
import * as majorNameToCode from './common/majorNameToCode.json'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { Scrollbar } from 'smooth-scrollbar-react'

const ForceGraph2D = dynamic(() => import('react-force-graph').then(mod => mod.ForceGraph2D), { ssr: false })

const codeToMajorName = (obj => Object.fromEntries(Object.entries(majorNameToCode).map(a => a.reverse())))(majorNameToCode)

var majors = Object.keys(j)
majors = majors.slice(0, -1)
var data = {nodes: [], links: []}

var dByMajors = {}

majors.forEach((major, i) => {
  let courses = Object.keys(j[major])
  courses.forEach(course => {
    let noTitle = course.match(/.{1,3} \d{3}[A-Z]{0,1}/)[0]
    data.nodes.push({id: noTitle, group: i, actual: course})
    if (!dByMajors[major]) dByMajors[major] = {nodes: [], links: []}
    dByMajors[major].nodes.push({id: noTitle, group: i, actual: course})
    let prereqs = j[major][course][0]?.Prereqs ? j[major][course][0]["Prereqs"] : "None"

    if (typeof prereqs != "string") {
      let ms = Object.keys(prereqs)
      ms.forEach(m => {
        let src = majorNameToCode[m]
        let p = prereqs[m]
        const helper = (obj) => {
          let k = Object.keys(obj)
          k.forEach(key => {
            let v = obj[key]
            if (!v.length) {
              helper(v)
            } else {
              if (typeof v == "string") {
                data.links.push({source: `${src} ${v}`, target: noTitle, value: 6})
                dByMajors[major].links.push({source: `${src} ${v}`, target: noTitle, value: 6})
                dByMajors[major].nodes.push({id: `${src} ${v}`, group: majors.indexOf(codeToMajorName[src]), actual: `${src} ${v}`})
              } else {
                v.forEach(c => {
                  if (typeof c == "string") {
                    data.links.push({source: `${src} ${c}`, target: noTitle, value: 6})
                    dByMajors[major].links.push({source: `${src} ${c}`, target: noTitle, value: 6})
                    dByMajors[major].nodes.push({id: `${src} ${c}`, group: majors.indexOf(`${src} - ${codeToMajorName[src]}`), actual: `${src} ${c}`})
                  } else {
                    helper(c)
                  }
                })
              }
            }
          })
        }

        helper(p)
      })
    }   
  })
})

let ids = data.nodes.map(n => n.id)
data.links = data.links.filter(l => {
  if (ids.includes(l.source)) {
    return true
  }
  return false
})

const getColor = id => `#${((id * 34563453) % Math.pow(2, 24)).toString(16).padStart(6, '0')}`

export default function Index() {
  const [ uData, setUData ] = useState(data)
  const [ filterOpen, setFilterOpen ] = useState(false)
  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <button onClick={e => {
          setFilterOpen(!filterOpen)
        }}>Filter</button>
        <Scrollbar className={styles["filter-drop"]} style={{ display: filterOpen ? "flex" : "none", right: "35px", top: "50px" }}>
          <button onClick={e => {
            setUData(data)
          }}>
            All
          </button>
          { majors.map(m => <button key={m} onClick={e => {
            setUData({nodes: dByMajors[m]?.nodes ? dByMajors[m].nodes : [], links: dByMajors[m]?.links ? dByMajors[m].links : []})
          }}>{m}</button>) }
        </Scrollbar>
      </div> 
      <ForceGraph2D
        graphData={uData}
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
    </div>
  )
}
