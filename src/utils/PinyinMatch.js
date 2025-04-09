/*
 * @Description: 
 * @Author: 
 * @Date: 2023-02-22 16:13:17
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-04-09 11:02:07
 */
import PinyinMatch from "pinyin-match";
import _ from "lodash";
export function pinyingSubs(val, { label, value }, data) {
  data = _.cloneDeep(data);
  let showData = [];
  if (val) {
    showData = data.filter((item) => {
      if (item[label]) {
        if (item[label].toUpperCase().indexOf(val.toUpperCase()) != -1) {
          return true;
        }
        return PinyinMatch.match(item[label], val);
      }
    });
    const showCodeArr = showData.map((item) => item[value]);
    if (showCodeArr.length) {
      for (let i = 0; i < data.length; i++) {
        if (!showCodeArr.includes(data[i][value])) {
          data[i].hidden = true;
        } else {
          data[i].hidden = false;
        }
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        data[i].hidden = true;
      }
    }
  } else {
    for (let i = 0; i < data.length; i++) {
      data[i].hidden = false;
    }
  }
  return data;
}

