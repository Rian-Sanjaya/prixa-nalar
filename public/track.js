/* eslint-disable */
var u,pId,aId,k,setDefault = e => ('string' != typeof e ? ('undefined' != typeof window ? window.location.search : '') : e),
  getRegex = e => new RegExp('[?&](' + e + ')=?([^&#]*)', 'i'),
  getOne = (e, t) => {
    const a = setDefault(t).match(getRegex(e));
    return !!a && (!a[2] || decodeURIComponent(a[2]));
  },
  getMany = (e, t) => e.reduce((e, a) => ((e[a] = getOne(a, setDefault(t))), e), {}),
  parse = e => {
    const t = setDefault(e).match(/\?(.+)/);
    if (t) {
      const e = t[1].split('&').map(function(e) {
        return e.split('=')[0].toLowerCase();
      });
      return getMany(e, t[0]);
    }
    return {};
  },
  getIDs = () => {
    let e, t;
    if (localStorage.getItem('getPartnerID') && localStorage.getItem('getAppID'))
      (e = localStorage.getItem('getPartnerID')), (t = localStorage.getItem('getAppID'));
    else if ('' !== window.location.search) {
      if (window.location.search.includes('pId=') && window.location.search.includes('&appId=')) {
        const a = parse(window.location.search);
        (e = a.pId), (t = a.appId);
      }
    } else {
      const a = window.location.pathname.split('/');
      (e = a[2]), (t = a[4]);
    }
    return { pId: e, appId: t };
  },
  startTracking = (e, t) => {
    u = `${e}/api/v1/analytics/track`,
    k = t,
    { pId, appId:aId } = getIDs();
  },
  track = function(e) {
    fetch(u, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'X-Prixa-API-Key': k,
        'X-Client-Id': pId,
        'X-Client-App-Id': aId,
        Authorization: localStorage.getItem('loginToken') ? `Bearer ${localStorage.getItem('loginToken')}` : void 0,
      },
      body: JSON.stringify(e),
    })
  };
window.ptrack = { start: startTracking, track };
