interface TRACKTYPE {
  event: string;
  properties: object;
}

export const UseTracking = (props: TRACKTYPE): void => {
  const data = {
    event: props.event,
    properties: props.properties,
    context: {
      locale: window.navigator.language,
      page: {
        path: window.location.pathname,
        search: window.location.search,
      },
    },
    integration: {
      ALL: 'false',
    },
    sentAt: new Date().toISOString(),
  };
  window.ptrack.track(data);
};

export default UseTracking;
