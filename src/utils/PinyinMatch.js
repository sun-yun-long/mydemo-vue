/*
 * @Description: 
 * @Author: 
 * @Date: 2023-02-22 16:13:17
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-04-09 11:02:07
 */
import PinyinMatch from "pinyin-match";

export function pinyingSubs(val, { label = "label" } = {}, data = []) {
  if (!val) {
    data.forEach(item => item.hidden = false);
    return data;
  }
  
  const searchVal = val.toUpperCase();
  data.forEach(item => {
    let isMatch = false;
    if (item[label]) {
      const target = String(item[label]);
      isMatch = target.toUpperCase().includes(searchVal) || !!PinyinMatch.match(target, val);
    }
    item.hidden = !isMatch;
  });
  
  return data;
}
