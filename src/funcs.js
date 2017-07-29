module.exports = {
  json: response => response.json(),

  status: response => {
    if (response.ok) {
      Promise.resolve(response);
    } else {
      Promise.reject(response);
    }
  },

  nodeListMap: (nodeList, cn) => {
    const newArray = [];
    for (let i = 0; i < nodeList.length; i++) {
      newArray.push(cn(nodeList[i]));
    }
    return newArray;
  },

  unique: collection => {
    return collection.reduce((result, ele) => {
      if (!result.includes(ele)) {
        result.push(ele);
      }
      return result;
    }, []);
  },

  cookies: () => {
    return document.cookie
      .split(";")
      .map(tuple => tuple.split("="))
      .reduce((cookies, val, i, input) => {
        cookies[val[0].replace(/^\s+|\s+$/g, "")] = val[1];
        return cookies;
      }, new Object());
  }
};
