import isFun from './isFun'

const addListener = (amapPlugin, props) => {
  const { events } = props;
  if (events != null) {
    console.log(events);
    const { onCreated, ...restEvents } = events;
    if (isFun(onCreated)) {
      onCreated(amapPlugin);
    }
    if (restEvents != null) {
      const keys = Object.keys(restEvents);
      console.log(keys);
      keys.forEach((key) => {
        amapPlugin.on(key, restEvents[key]);
      })
    }
  }
};

export default addListener;
