// @flow
import React from 'react'
import log from '../utils/log'
import withPropsReactive from '../utils/withPropsReactive'
import addListener from '../utils/eventsUitl'


type DragRouteProps = {
  __map__: Object;
  map?: Object;
  initPaths: Array<Object>;
  drivingPolicy: DrivingPolicy;
  events?: DragRouteEvent;
}

type DragRouteEvent = {
  complete: Function;
  addway: Function;
}

export class DragRoute extends React.Component <DragRouteProps, {}> {
  map: Object
  setterMap: Function
  dragRoute: Object
  element: Object
  constructor(props: DragRouteProps) {
    super(props);
      if (typeof window !== 'undefined') {
      if (!props.__map__) {
        log.warning('MAP_INSTANCE_REQUIRED')
      } else {
        const self = this
        this.setterMap = {
          visible(val) {
            if (val) {
              self.dragRoute && self.dragRoute.show()
            } else {
              self.dragRoute && self.dragRoute.hide()
            }
          },
          zIndex(val) {
            self.dragRoute && self.dragRoute.setzIndex(val)
          }
        }
        this.map = props.__map__
        this.element = this.map.getContainer()
        setTimeout(() => {
          this.createDragRoute(props)
        }, 13)
      }
    }
  }

  render() {
    return null
  }

   createDragRoute(props: DragRouteProps) {

    this.map.plugin(['AMap.DragRoute'], () => {
      console.log('1212');
      this.dragRoute = new window.AMap.DragRoute(this.map, this.props.initPaths, this.props.drivingPolicy);
      console.log(this.dragRoute);
      addListener(this.dragRoute, props);
      this.dragRoute.search();
    })
  }

}

export default withPropsReactive(DragRoute);
