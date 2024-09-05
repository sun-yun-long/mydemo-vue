/*
 * @Description: 
 * @Author: 
 * @Date: 2022-11-24 13:17:18
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-11-21 19:17:20
 */

const CHART_OPTION = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)'
      }
    }
  ]
}

const dataX = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const dataY = [120, 200, 150, 80, 70, 110, 130];

const CHART_OPTION2 = {
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [],
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)'
      }
    }
  ]
}

const CHART_OPTION3 = {
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

export default {
  CHART_OPTION,
  CHART_OPTION2,
  CHART_OPTION3,
  dataX,
  dataY
}