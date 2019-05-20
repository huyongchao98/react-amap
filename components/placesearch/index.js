// @flow
import React from 'react'
import log from '../utils/log'
import withPropsReactive from '../utils/withPropsReactive'
import addListener from '../utils/eventsUitl'

export interface PlaceSearchProps {
  city?: string;
  citylinit?: boolean;
  children?: number;
  type?: string;
  lang?: string;
  pageSize?: number;
  pageIndex?: number;
  extensions?: stirng;
  map?: object;
  panel?: string | object;
  showCover?: boolean;
  renderStyle?: string;
  autoFitView?: boolean;
  events?: PlaceSearchEvent;
}

export interface PlaceSearchEvent {
  onCreated: func,
  complete: func,
  error: func,
  selectChanged: func,
  listElementClick: func,
  markerClick: func,
}

class PlaceSearch extends React.Component <PlaceSearchProps, {}> {
  map: Object
  placeSearch: Object

  constructor(props: PlaceSearchProps) {
    super(props);
    if (typeof window !== 'undefined') {
      if (!props.__map__) {
        log.warning('MAP_INSTANCE_REQUIRED')
      } else {
        const self = this
        this.setterMap = {
          visible(val) {
            if (val) {
              self.placeSearch && self.placeSearch.show()
            } else {
              self.placeSearch && self.placeSearch.hide()
            }
          },
          zIndex(val) {
            self.placeSearch && self.placeSearch.setzIndex(val)
          }
        }
        this.map = props.__map__
        this.element = this.map.getContainer()
        setTimeout(() => {
          this.createPlaceSearch(props)
        }, 13)
      }
    }
  }

  createPlaceSearch(props: PlaceSearchProps) {

    this.map.plugin(['AMap.PlaceSearch'], () => {
      let ops = this.buildCreateOptions(this.props);
      this.placeSearch = new window.AMap.PlaceSearch(ops);
      addListener(this.placeSearch, props);
    })
  }

  // 在创建实例时根据传入配置，设置初始化选项
  buildCreateOptions(props: PlaceSearchProps) {
    let opts = {};

    const allPlaceSearchOptions = [
      'city',
      'citylinit',
      'children',
      'type',
      'lang',
      'pageSize',
      'pageIndex',
      'extensions',
      'map',
      'panel',
      'showCover',
      'renderStyle',
      'autoFitView',
      'events'
    ];

    allPlaceSearchOptions.forEach((key) => {
      if (key in props) {
        opts[key] = props[key];
      }
    })
    opts.map = this.map
    return opts
  }

  render() {
    return null
  }

}

export default withPropsReactive(PlaceSearch);
