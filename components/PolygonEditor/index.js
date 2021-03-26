// @flow
import React from 'react'
import withPropsReactive from '../utils/withPropsReactive'
import log from '../utils/log'

type EditorProps = {
  __map__: Object,
  __ele__: HTMLElement,
  polygonPath: Object[],
  polygon: Element[],
  targetIndex: number,
  delIndex: number,
  delComplete: Function,
  active: boolean,
  events?: Object,
  onInstanceCreated?: Function
}
class PolygonEditor extends React.Component<EditorProps, {}> {

  map: Object
  targetIndex: number
  polygonEditor: Object
  setterMap: Object
  open: boolean
  PolygonComponents: Object[]

  constructor(props: EditorProps) {
    super(props)
    if (typeof window !== 'undefined') {
      console.log('PolygonEditor')
      if (!props.__map__) {
        log.warning('MAP_INSTANCE_REQUIRED')
      } else {
        const self = this
        this.map = props.__map__
        this.createEditorInstance().then(() => {
          this.props.onInstanceCreated && this.props.onInstanceCreated()
        })
      }
    }
  }

  get instance() {
    return this.polygonEditor
  }

  componentDidUpdate() {
    console.log('componentWillUpdate')
    if (this.polygonEditor != null) {
      const { polygonPath, polygon: polygonComponents, targetIndex, delIndex, delComplete } = this.props

      if (delIndex != null && this.PolygonComponents != null && this.PolygonComponents.length > delIndex) {
        this.PolygonComponents[delIndex].remove()
        if (delComplete != null) {
          delComplete()
        }
      }

      if (targetIndex < 0) {
        this.polygonEditor.close()
        this.open = false
        return
      }

      if (polygonComponents != null && polygonComponents.length > 1 && polygonComponents !== this.PolygonComponents) {
        let thePolygonComponents = polygonComponents
        this.polygonEditor.setAdsorbPolygons(thePolygonComponents)
        this.PolygonComponents = thePolygonComponents
      }
      if (targetIndex >= 0 && targetIndex < polygonPath.length) {

        const targetPolyGon = polygonPath[targetIndex]

        if (targetIndex >= 0 && targetPolyGon.length === 0) {
          this.polygonEditor.close()
          this.polygonEditor.setTarget()
        } else if (polygonComponents != null && targetIndex >= 0 && polygonComponents.length > targetIndex && !this.open) {
          this.polygonEditor.close()
          this.polygonEditor.setTarget(polygonComponents[targetIndex])
        }
        this.polygonEditor.open()
        this.open = true
      }

    }
  }

  createEditorInstance() {
    if (this.polygonEditor) {
      return Promise.resolve(this.polygonEditor)
    }
    return new Promise((resolve) => {
      this.map.plugin(['AMap.PolygonEditor'], () => {
        this.polygonEditor = new window.AMap.PolygonEditor(
          this.map
        )
        resolve(this.polygonEditor)
      })
    })
  }

  detectPropChanged(key: string, nextProps: EditorProps) {
    return this.props[key] !== nextProps[key]
  }

  render() {
    return null
  }
}

export default withPropsReactive(PolygonEditor)
