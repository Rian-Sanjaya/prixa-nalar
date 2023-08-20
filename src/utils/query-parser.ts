const setDefault = (url: string) => {
  return typeof url !== 'string' ? (typeof window !== 'undefined' ? window.location.search : '') : url;
};

const getRegex = (name: string) => {
  return new RegExp('[?&](' + name + ')=?([^&#]*)', 'i');
};

const getOne = (name: string, text: string) => {
  const match = setDefault(text).match(getRegex(name));
  if (!match) {
    return false;
  } else if (match[2]) {
    return decodeURIComponent(match[2]);
  } else {
    return true;
  }
};

const getMany = (arr: Array<any>, text: string) => {
  return arr.reduce((obj, key) => {
    obj[key] = getOne(key, setDefault(text));
    return obj;
  }, {});
};

export const parse = (url: string) => {
  const checkedUrl = setDefault(url).match(/\?(.+)/);

  if (!checkedUrl) {
    return {};
  } else {
    const keys = checkedUrl[1].split('&').map(function(pair) {
      return pair.split('=')[0].toLowerCase();
    });
    return getMany(keys, checkedUrl[0]);
  }
};
