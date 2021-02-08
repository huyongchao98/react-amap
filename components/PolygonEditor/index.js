// @flow
import React from 'react'
import withPropsReactive from '../utils/withPropsReactive'
import log from '../utils/log'

type EditorProps = {
  __map__: Object,
  __ele__: HTMLElement,
  polygon: Object[],
  targetIndex: number,
  active: boolean,
  events?: Object,
  onInstanceCreated?: Function
}

class PolygonEditor extends React.Component<EditorProps, {}> {

  map: Object
  polygon: Object[]
  targetIndex: number
  editorActive: boolean
  polygonEditor: Object
  setterMap: Object

  constructor(props: EditorProps) {
    super(props)
    if (typeof window !== 'undefined') {
      console.log('PolygonEditor')
      if (!props.__map__) {
        log.warning('MAP_INSTANCE_REQUIRED')
      } else {
        const self = this
        this.setterMap = {
          active(val) {
            self.toggleActive(val)
          }
        }
        this.map = props.__map__
        this.editorActive = false
        this.polygon = props.polygon
        this.targetInde = props.targetIndex
        this.createEditorInstance().then(() => {
          this.props.onInstanceCreated && this.props.onInstanceCreated()
        })
      }
    }
  }

  get instance() {
    return this.polygonEditor
  }

  toggleActive(active: boolean) {
    if (active) {
      if (!this.editorActive) {
        this.activeEditor()
      }
    } else {
      if (this.editorActive) {
        this.inactiveEditor()
      }
    }
  }

  activeEditor() {
    if (this.polygonEditor) {
      this.editorActive = true
      this.polygonEditor.open()
    }
  }

  inactiveEditor() {
    this.editorActive = false
    if (this.polygonEditor) {
      this.polygonEditor.close()
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
        if (this.polygon != null && this.polygon.length > 0) {
          this.polygonEditor.addAdsorbPolygons(this.polygon)
        }
        if (this.targetIndex >= 0 && this.targetIndex < this.polygon.length) {
          this.polygonEditor.setTarget(this.polygon[this.targetIndex])
        }
        resolve(this.polygonEditor)
      })
    })
  }


  detectPropChanged(key: string, nextProps: PolyProps) {
    return this.props[key] !== nextProps[key]
  }


  render() {
    return null
  }
}

export default withPropsReactive(PolygonEditor)
