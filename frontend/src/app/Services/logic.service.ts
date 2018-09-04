import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class LogicService {
  constructor() {}

  pictureId = () => {
    let n = 6;
    let set = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    let pw = [];
    let arr;
    arr = Array.from({ length: n }, () =>
      Math.floor(Math.random() * set.length)
    );
    for (let i = 0; i < arr.length; i++) {
      let j = arr[i] % set.length;
      pw.push(set[j]);
    }
    return pw.join("");
  };

  logicXor = (a, b) => {
    return (a && !b) || (!a && b);
  };

  pushAll = (arr: Array<any>, input) => {
    for (let i = 0; i < arr.length; i++){
      arr.map(x => x.push(input));
    }
  };

  popAll = (arr: Array<any>, input) => {
    for (let i = 0; i < arr.length; i++){
      arr.map(x => x.pop());
    }
  };

  
  isEmpty = obj => {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  };
}
