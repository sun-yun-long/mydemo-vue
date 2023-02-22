/*
 * @Description: 
 * @Author: 
 * @Date: 2023-02-22 16:13:17
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-22 16:22:08
 */
import PinyinMatch from "pinyin-match";
export function pinyingSubs(val, label, arr, copy) {
  if (val) {
    return arr = copy.filter((item) => {
      if (item[label]) {
        if (item[label].toUpperCase().indexOf(val.toUpperCase()) != -1) {
          return true;
        }
        return PinyinMatch.match(item[label], val);
      }
    });
  } else {
    return arr = copy;
  }
}

