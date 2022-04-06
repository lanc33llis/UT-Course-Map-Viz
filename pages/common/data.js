import * as j from '../common/test.json'
import * as majorNameToCode from '../common/majorNameToCode.json'

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

export { data, dByMajors, majors, codeToMajorName }