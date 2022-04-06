import styles from '../styles/Index.module.sass'

import { useState, useRef } from 'react'
import { Scrollbar } from 'smooth-scrollbar-react'

import ForceGraph from './components/ForceGraphWrapper'
import { majors, data, dByMajors } from './common/data'

export default function Index() {
  const [ uData, setUData ] = useState(data)
  const [ filterOpen, setFilterOpen ] = useState(false)
  const forceGraph = useRef()

  const handleFilter = () => {
    let fg = forceGraph.current
    console.log(fg)
    // fg.centerAt(0, 0, 100)
    // fg.zoom(.75)
  }

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <button onClick={e => {
          setFilterOpen(!filterOpen)
        }}>Filter</button>
        <Scrollbar className={styles["filter-drop"]} style={{ display: filterOpen ? "flex" : "none", right: "35px", top: "50px" }}>
          <button onClick={e => {
            setUData(data)
            handleFilter()
          }}>
            All
          </button>
          { majors.map(m => <button key={m} onClick={e => {
            setUData({nodes: dByMajors[m]?.nodes ? dByMajors[m].nodes : [], links: dByMajors[m]?.links ? dByMajors[m].links : []})
            handleFilter()
          }}>{m}</button>) }
        </Scrollbar>
      </div> 
      <ForceGraph ref={forceGraph} data={data}/>
    </div>
  )
}
