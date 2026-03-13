export default {
  // echarts数据视图样式
  optionToContent(opt, name) {
    let tableName = ''
    if (name) tableName = name
    let axisData = opt.xAxis[0].data; //坐标数据
    let series = opt.series; //折线图数据
    let tdHeads = `<td  style="padding: 0 10px;min-width: 100px;">${tableName}</td>`; //表头
    let tdBodys = ''; //数据
    series.forEach(item => {
      //组装表头
      tdHeads += `<td style="padding: 0 10px;min-width: 120px;">${item.name}</td>`;
    });
    let table = `<table border="1" style="margin-left:20px;border-collapse:collapse;font-size:14px;text-align:center"><tbody><tr>${tdHeads} </tr>`;
    for (let i = 0, l = axisData.length; i < l; i++) {
      for (let j = 0; j < series.length; j++) {
        series[j].data[i] = series[j].data[i] ?? "";
        //组装表数据
        tdBodys += `<td>${series[j].data[i]}</td>`;
      }
      table += `<tr><td style="padding: 0 10px">${axisData[i]}</td>${tdBodys}</tr>`;
      tdBodys = '';
    }
    table += '</tbody></table>';
    return table;
  },
}