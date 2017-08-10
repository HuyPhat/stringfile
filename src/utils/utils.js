import {filter} from 'lodash';
const getCode = (str, pos, position) => {
  let alphabet = String.alphabet;
  let code = pos;
  if (code) {
    let i = pos;
    while (code < 76 && code > 65) {
      code = getCode(str, i);
      ++i;
    }
    // for (i = pos; code = getCode(str, i), code < 76 && code > 65;) {++i;}
    return +str.slice(pos - 1, i);
  }
  code = alphabet && alphabet.indexOf(str.charAt(pos));
  if (code > -1) {
    return code + 76;
  } else if (!str.charCodeAt(pos)) {
    return 0;
  } else if (str.charCodeAt(pos) < 45 || str.charCodeAt(pos) > 127) {
    return str.charCodeAt(pos);
  } else if (code < 46) {
    return 65; // -
  } else if (code < 48) {
    return code - 1;
  } else if (code < 58) {
    return code + 18; // 0-9
  } else if (code < 65) {
    return code - 11;
  } else if (code < 91) {
    return code + 11; // A-Z
  } else if (code < 97) {
    return code - 37;
  } else if (code < 123) {
    return code + 5; // a-z
  } else {
    return code - 63;
  }
};

export const naturalSort = (a, b) => {
  // setup temp-scope variables for comparison evauluation
  if (!isNaN(a) && !isNaN(b)) {
    if (a === b) {
      return 0;
    } else if (parseFloat(a) > parseFloat(b)) {
      return 1;
    } else {
      return -1;
    }
  }

  var re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|-?[0-9]+)/gi;
  var sre = /(^[ ]*|[ ]*$)/g;
  var hre = /^0x[0-9a-f]+$/i;
  var dre = /(^[0-9\-\.\/]{5,}$)|[0-9]+:[0-9]+|( [0-9]{4})/i;
  var ore = /^0/;
  // convert all to strings and trim()
  var x = a.toString().toLowerCase().replace(sre, '') || '';
  var y = b.toString().toLowerCase().replace(sre, '') || '';
  // chunk/tokenize
  var xN = x.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0');
  var yN = y.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0');
  // numeric, hex or date detection
  var xD = parseInt(x.match(hre)) || (xN.length !== 1 && x.match(dre) && (new Date(x)).getTime());
  var yD = parseInt(y.match(hre)) || xD && (new Date(y)).getTime() || null;
  // natural sorting of hex or dates - prevent '1.2.3' valid date
  if (yD) {
    if (xD < yD) {
      return -1;
    } else if (xD > yD) {
      return 1;
    }
  }
  // natural sorting through split numeric strings and default strings
  for (var cLoc = 0, numS = Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
    // find floats not starting with '0', string or 0 if not defined (Clint Priest)
    var oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
    var oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
    // handle numeric vs string comparison - number < string - (Kyle Adams)
    if (isNaN(oFxNcL) !== isNaN(oFyNcL)) {return (isNaN(oFxNcL)) ? 1 : -1;}
    // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
    else if (typeof oFxNcL !== typeof oFyNcL) {
      oFxNcL += '';
      oFyNcL += '';
    }
    if (oFxNcL < oFyNcL) {return -1;}
    if (oFxNcL > oFyNcL) {return 1;}
  }
  return 0;
};

export const getValuePath = (data, key) => {//Get value of object by path, ex: file.sharing.time
  let keys = key.split('.');
  var value = data;
  keys.map((item) => {
    value = value[item];
  }, this);
  if (value === null) {
    v = '';
  }
  return value;
};

//Validate email
export const validateEmail = (email) => {
  if (!email || email.length > 256) {
    return false;
  }
  // var re = /(?:[a-z0-9!#$%&'*+\/=?^_{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;
  var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g;
  ///^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export const validateDomain = (domain) => {
  var re = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/gi;
  return re.test(domain);
};
export const preventTriggerParent = (event) => {
  event.preventDefault();
  event.stopPropagation();
};

export const pluralAppend = (number) => {
  return number === 1 ? '' : 's';
};
function filterObject(obj, keyword) {
  const regex = new RegExp(keyword, 'gi');
  for (let i in obj) {
    if (obj.hasOwnProperty(i) && typeof obj[i] !== 'object') {
      if (regex.test(obj[i])) {
        return true;
      }
    } else if (filterObject(obj[i], keyword)) {
      return true;
    }
  }
  return false;
}
export const filterArrayObj = (arr, keyword) => {
  let result;
  result = filter(arr, (a) => {
    return filterObject(a, keyword);
  });
  return result;
};
