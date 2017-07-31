module.exports = {
    findGroupIndex: (groups, g_id) => {
      return groups.findIndex(group => group.id == g_id)
    },

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
    },

    createCookie: (key, val, daysValid) => {
        let expires
        if (daysValid) {
            const date = new Date();
            date.setTime(date.getTime() + (daysValid * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toGMTString();
        } else {
            expires = '';
        }
        document.cookie = key + '=' + val + expires + '; path=/';
    },

    deleteCookie: name => {
        document.cookie =
            `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    }
};