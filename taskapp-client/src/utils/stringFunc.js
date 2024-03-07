export const stringListComma = (list = []) => {
  let s = ''
  for (const el of list) {
    s += el + ', '
  }
  const res = s?.slice(0, -2)
  return res;
}

export const stringListDash = (list = []) => {
  let s = ''
  for (const el of list) {
    s += el + ' - '
  }
  const res = s?.slice(0, -2)
  return res;
}
//comma
export const objectToString = (obj) => {
  let s = ''
  for (const el in obj) {
    s += obj[el] + ', '
  }
  const res = s?.slice(0, -2)
  return res
}


export const watchMoreString = (str = '', mlength) => {
  if (str?.length <= mlength) {
    return str?.slice(0, mlength) 
  } else {
    return str?.slice(0, mlength) + '...'
  }
}

export const queryUrlClient = (queryObj = {}) => {
  let temp = {...queryObj}
  let res = '?'
  if (temp.subpage) {
    res += 'subPage=' + temp.subpage+'&'
  }
  if (temp.category) {
    res += 'category='+temp.category+'&'
  }
  if (temp.attributes) {
    for (let attribute in temp.attributes) {
      for (let i = 0; i < temp.attributes[attribute].length; i++) {
        res += `attributes.${attribute}[${i}]=${temp.attributes[attribute][i]}&`
      }
    }
  }
  return res
}

//page, role, sort
export const queryUrlServer = (queryObj = {}) => {
  let res = '?'
  let temp = {...queryObj}

  if (temp.partnerName) {
    res += 'text[search]=' + temp.partnerName + '&'
    delete temp['partnerName']
  }

  if (temp.userName) {
    res += 'text[search]=' + temp.userName + '&'
    delete temp['userName']
  }
  if (temp.subpage) {
    res += 'subPage=' + temp.subpage +   '&'
    delete temp['subpage']
  }
  if (temp.category) {
    res += 'or[0][category]='+temp.category+'&or[1][subCategory]='+temp.category+'&'
    delete temp['category']
  }
  if (temp.attributes) {
    let t = 3
    for (let attribute in temp.attributes) {
      for (let i = 0; i < temp.attributes[attribute].length; i++) {
        res += `or[${t++}][attributes.${attribute}][in][${i}]=${temp.attributes[attribute][i]}&`
      }
    }
    delete temp['attributes']
  }
  if (temp.orders) {
    for (let i = 0; i < temp.orders.length; i++) {
      res += `_id[in][${i}]=${temp.orders[i]}&`
    }
    delete temp['orders']
  }
  for (let el in temp) {
    if (temp[el]) {
      res += `${el}=${temp[el]}&`
    }
  }
  return res
}


export const priceValidate = (price = '') => {
  let res = "";
  //let price = productPrice.toString()
  for (let i = 0; i < price.toString().length; i++) {
    if (
      (price.toString().length - i + 2) % 3 === 0 &&
      i !== price.toString().length - 1
    ) {
      res = res + price.toString()[i] + ".";
      continue;
    }
    res += price.toString()[i];
  }
  return res;
};

export const getDateIosString = (str) => {
  const nDate = new Date(str)
  return `${nDate.getDate()}-${nDate.getMonth()+1}-${nDate.getFullYear()}`
}

export const getDateByTimeStamps = (timestamps = '') => {
  let res = ''
  res = timestamps?.slice(0, 10)
  return res
}

const formatTimeComponent = (time) => {

}

export const getTimeIosString = (str) => {
  console.log(str);
  const givenDate = new Date(str)

  // const offset = -(givenDate.getTimezoneOffset() / 60);

  // let hours = givenDate.getHours()
  // hours += offset
  // givenDate.setHours(hours)
  
  console.log(givenDate.toISOString())
  return `${givenDate.getHours()}:${givenDate.getMinutes()}`
}
