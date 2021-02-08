// @flow
import React from 'react'
import withPropsReactive from '../utils/withPropsReactive'
import log from '../utils/log'

type EditorProps = {
  __map__: Object,
  __ele__: HTMLElement,
  __polygon__: Object,
  active: boolean,
  events?: Object,
  onInstanceCreated?: Function
}

class PolygonEditor extends React.Component<EditorProps, {}> {

  map: Object
  polygon: Object 
  editorActive: boolean
  polygonEditor: Object
  setterMap: Object

  constructor(props: EditorProps) {
    super(props)
    if (typeof window !== 'undefined') {
      console.log('PolygonEditor')
      if (!(props.__map__ && props.__polygon__)) {
        log.warning('MAP_INSTANCE_REQUIRED')
      } else {
        const self = this
        this.setterMap = {
          active(val) {
            self.toggleActive(val)
          }
        }
        this.map = props.__map__
        this.polygon = props.__polygon__
        this.editorActive = false
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
          this.map, this.polygon
        )
        resolve(this.polygonEditor)
      })
    })
  }

  render() {
    return null
  }
}

export default withPropsReactive(PolygonEditor)
