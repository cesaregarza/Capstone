//Convert to Base 62
const basex = {};

basex.set = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

basex.encode = (int) => {
  if (int == 0){
    return 0;
  }
  let x = basex.set.length;
  let q = [];
  let s = [];
  
  while (int > 0){
    q.push(basex.set[int % x]);
    int = (int - int % x) / x;

  }
  for (let i = 1; i <= q.length; i++){
    s.push(q[q.length - i]);
  }
  s = s.join('');
  return s;
};

basex.decode = (str) => {
  let x = basex.set.length;
  let re = /[^a-zA-Z\d]+/;
  str = str.replace(re,'');
  str = str.split("");
  let res = 0;
  
  for (let i = 0; i < str.length; i++){
    let temp = basex.set.indexOf(str[str.length-i-1]);
    res += temp * Math.pow(basex.set.length, i);
  }
  
  return res;
  
};

basex.compress = (arr) => {
  let temp = [];
  for (let i = 0; i < arr.length; i++){
    temp.push(basex.encode(arr[i]));
  }
  
  return temp.join(",");
};

basex.decompress = (str) => {
  let temp = str.split(",");
  for (let i = 0; i < temp.length; i++){
    temp[i] = basex.decode(temp[i]);
  }
  
  return temp;
};

exports.encode = basex.encode;
exports.decode = basex.decode;
exports.compress = basex.compress;
exports.decompress = basex.decompress;