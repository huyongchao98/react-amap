// @flow
import React from 'react'
import withPropsReactive from '../utils/withPropsReactive'
import log from '../utils/log'
import Polygon from '../polygon'

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
  targetIndex: number
  polygonEditor: Object
  editorActive: boolean
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

  componentDidUpdate() {
    console.log('componentWillUpdate')
    if (this.polygonEditor != null) {
      const { polygon, targetIndex } = this.props
   
      const polygonComponents = polygon?.filter(item => item.length >= 3).map(item => {
        console.log('item:', item)
        return <Polygon path={item} />
      })

      console.log('polygon:', polygon)
      console.log('targetIndex:', targetIndex)
      if (polygonComponents != null && polygonComponents.length > 1) {
        this.polygonEditor.addAdsorbPolygons(polygon)
      }
      if (targetIndex >= 0 && targetIndex < polygon.length) {
        const target = polygon[targetIndex]
        if (target.length === 0) {
          this.polygonEditor.setTarget()
        }
        this.polygonEditor.open()
      }

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
        resolve(this.polygonEditor)
      })
    })
  }


  detectPropChanged(key: string, nextProps: EditorProps) {
    console.log('key', key)
    console.log('key value', this.props[key])
    console.log('next key value', nextProps[key])
    return this.props[key] !== nextProps[key]
  }


  render() {
    return null
  }
}

export default withPropsReactive(PolygonEditor)
