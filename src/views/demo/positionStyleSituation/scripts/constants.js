const CHART_OPTION1 = {
  tooltip: {
    position: 'top',
    formatter: (params) => {
      if (params.data.title) {
        return params.data.title
      } else {
        return params.data.value[2] + '%'
      }
    }
  },
  grid: {
    height: '80%',
    top: '10%'
  },
  xAxis: {
    type: 'category',
    data: ['', '', '', ''],
    splitArea: {
      show: true
    },
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    }
  },
  yAxis: {
    type: 'category',
    data: ['', '', '', ''],
    splitArea: {
      show: true
    },
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false
    }

  },
  visualMap:
  {
    min: 0,
    max: 102,
    calculable: true,
    type: "piecewise",
    orient: 'continuous',
    left: 'center',
    bottom: '0%',
    pieces: [
      { gt: 101, color: '#313695', symbol: 'rect' },
      { gte: 0, lt: 10, color: '#FF7600', symbol: 'rect' },
      { gte: 10, lt: 20, color: '#FF9100', symbol: 'rect' },
      { gte: 20, lt: 30, color: '#FFA600', symbol: 'rect' },
      { gte: 30, lt: 40, color: '#FFC100', symbol: 'rect' },
      { gte: 40, lt: 50, color: '#FFD600', symbol: 'rect' },
      { gte: 50, lt: 60, color: '#FFF100', symbol: 'rect' },
      { gte: 60, lt: 70, color: '#90EE90', symbol: 'rect' },
      { gte: 70, lt: 80, color: '#ADFF2F', symbol: 'rect' },
      { gte: 80, lt: 101, color: '#7CFC00', symbol: 'rect' },
    ],
    show: false
  },
  series: [
    {
      name: 'Punch Card',
      type: 'heatmap',
      data: [
        {
          title: "价值",
          //[x坐标, y坐标, value值]
          value: [0, 0, 102],
          customParam2: "自定义2-1"
        },
        {
          title: "平衡",
          value: [0, 1, 102],
          customParam2: "自定义2-2"
        },
        {
          title: "成长",
          value: [0, 2, 102],
          customParam2: "自定义2-3"
        },
        {
          title: "近一年",
          value: [0, 3, 102],
          customParam2: "自定义2-4"
        },
        {
          title: "大盘",
          value: [1, 3, 102],
          customParam2: "自定义2-5"
        },
        {
          title: "中盘",
          value: [2, 3, 102],
          customParam2: "自定义2-6"
        },
        {
          title: "小盘",
          value: [3, 3, 102],
          customParam2: "自定义2-7"
        },
        {
          value: [3, 2, 30],
          customParam2: "自定义2-8"
        },
        {
          value: [3, 1, 0],
          customParam2: "自定义2-9"
        },
        {
          value: [2, 2, 100],
          customParam2: "自定义2-10"
        }
      ],
      label: {
        show: true,
        formatter: (params) => {
          if (params.data.title) {
            return params.data.title
          } else {
            return params.data.value[2] + '%'
          }
        },
      },
      emphasis: {
        itemStyle: {
          // shadowBlur: 10,
          // shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}

const Columns = [
  {
    prop: 'prop',
    label: '因子',
    align: 'center',
    minWidth: '100'
  },
  {
    prop: 'prop12',
    label: '12月',
    align: 'right',
    minWidth: '100'
  },
  {
    prop: 'prop11',
    label: '11月',
    align: 'right',
    minWidth: '100'
  },
  {
    prop: 'prop10',
    label: '10月',
    align: 'right',
    minWidth: '100'
  },
  {
    prop: 'prop9',
    label: '9月',
    align: 'right',
    minWidth: '100'
  },
  {
    prop: 'prop8',
    label: '8月',
    align: 'right',
    minWidth: '100'
  },
  {
    prop: 'prop7',
    label: '7月',
    align: 'right',
    minWidth: '100'
  },
  {
    prop: 'prop6',
    label: '6月',
    align: 'right',
    minWidth: '100'
  },
  {
    prop: 'prop5',
    label: '5月',
    align: 'right',
    minWidth: '100'
  },
  {
    prop: 'prop4',
    label: '4月',
    align: 'right',
    minWidth: '100'
  },
  {
    prop: 'prop3',
    label: '3月',
    align: 'right',
    minWidth: '100'
  },
  {
    prop: 'prop2',
    label: '2月',
    align: 'right',
    minWidth: '100'
  },
  {
    prop: 'prop1',
    label: '1月',
    align: 'right',
    minWidth: '100'
  },
  {
    prop: 'propqc',
    label: '期初',
    align: 'right',
    minWidth: '100'
  },
]
const tableData = [
  { prop: '贝塔' },
  { prop: '残余波动率' },
  { prop: 'BP' },
  { prop: 'EP' },
  { prop: '长期逆转' },
  { prop: '市值' },
  { prop: '中盘' },
  { prop: '盈利能力' },
  { prop: '盈利质量' },
  { prop: '盈利波动率' },
  { prop: '投资质量' },
  { prop: '杠杆' },
  { prop: '流动性' },
  { prop: '成长' },
  { prop: '股息率' },
  { prop: '动量' },
]

export default {
  CHART_OPTION1,
  Columns,
  tableData,
}