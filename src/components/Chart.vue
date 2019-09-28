<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '345px'
    },
    height: {
      type: String,
      default: '280px'
    },
    radarData: Object
  },
  data() {
    return {
      visualizedData: [],
      chart: null
    }
  },
  mounted() {
    let recaptchaScript = document.createElement('script')
    recaptchaScript.setAttribute('src', 'http://echarts.baidu.com/gallery/vendors/echarts/echarts.min.js')
    document.head.appendChild(recaptchaScript)
    let recaptchaScript2 = document.createElement('script')
    recaptchaScript.setAttribute('src', 'http://echarts.baidu.com/gallery/vendors/echarts-gl/echarts-gl.min.js')
    document.head.appendChild(recaptchaScript2)    
    let recaptchaScript3 = document.createElement('script')
    recaptchaScript.setAttribute('src', 'http://echarts.baidu.com/gallery/vendors/echarts-stat/ecStat.min.js')
    document.head.appendChild(recaptchaScript3)    
    let recaptchaScript4 = document.createElement('script')
    recaptchaScript.setAttribute('src', 'http://echarts.baidu.com/gallery/vendors/echarts/extension/dataTool.min.js')
    document.head.appendChild(recaptchaScript4)    
    let recaptchaScript5 = document.createElement('script')
    recaptchaScript.setAttribute('src', 'http://echarts.baidu.com/gallery/vendors/echarts/map/js/china.js')
    document.head.appendChild(recaptchaScript5)    
    let recaptchaScript6 = document.createElement('script')
    recaptchaScript.setAttribute('src', 'http://echarts.baidu.com/gallery/vendors/echarts/map/js/world.js')
    document.head.appendChild(recaptchaScript6)    
    let recaptchaScript7 = document.createElement('script')
    recaptchaScript.setAttribute('src', 'https://api.map.baidu.com/api?v=2.0&ak=xfhhaTThl11qYVrqLZii6w8qE5ggnhrY&__ec_v__=20190126')
    document.head.appendChild(recaptchaScript7)    
    let recaptchaScript8 = document.createElement('script')
    recaptchaScript.setAttribute('src', 'http://echarts.baidu.com/gallery/vendors/echarts/extension/bmap.min.js')
    document.head.appendChild(recaptchaScript8)    
    let recaptchaScript9 = document.createElement('script')
    recaptchaScript.setAttribute('src', 'http://echarts.baidu.com/gallery/vendors/simplex.js')
    document.head.appendChild(recaptchaScript9) 
    this.generateData()   
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    generateData() {
        for (const [category, value] of Object.entries(this.$props.radarData)) {
            let entry = {};
            switch(category){
                case 'BigData':
                    entry = {
                        value: [value.R, value.U, value.P],
                        name: 'BigData',
                        symbol: 'rect',
                        symbolSize: 5,
                        label: {
                            normal: {
                                show: true,
                                formatter:function(params) {
                                    return params.value;
                                }
                            }
                        }
                    }
                    break;
                case 'Backend':
                    entry = {
                        value: [value.R, value.U, value.P],
                        name: 'Backend',
                            areaStyle: {
                                normal: {
                                    color: 'rgba(255, 255, 255, 0.5)'
                                }
                            },
                            lineStyle: {
                                normal: {
                                    type: 'dashed'
                                }
                            },
                            label: {
                                normal: {
                                    show: true,
                                    formatter:function(params) {
                                        return params.value;
                                    }
                                }
                            }
                    }
                    break;
                case 'Android':
                    entry = {
                        value: [value.R, value.U, value.P],
                        name: 'Android',
                            areaStyle: {
                                normal: {
                                    color: 'rgba(200, 255, 255, 0.5)'
                                }
                            },
                            label: {
                                normal: {
                                    show: true,
                                    formatter:function(params) {
                                        return params.value;
                                    }
                                }
                            }
                    }
                    break;
            }
                
            this.visualizedData.push(entry);
        }
    },
    initChart() {
        this.chart = echarts.init(document.getElementById(this.id))
        this.chart.setOption({
            // title: {
            //     text: ''
            // },
            legend: {
                data: ['BigData','Backend', 'Android']
            },
            radar: [
                {
                    indicator: [
                        { name: 'Reputation/Social Influence', max: 100 },
                        { name: 'Usability', max: 100 },
                        { name: 'Proactivity', max: 100 },
                    ],
                    center: ['50%', '65%'],
                    radius: 100,
                    startAngle: 90,
                    splitNumber: 3,
                    shape: 'circle',
                    name: {
                        formatter:'【{value}】',
                        textStyle: {
                            color:'#72ACD1'
                        }
                    },
                    splitArea: {
                        areaStyle: {
                            color: ['rgba(114, 172, 209, 0.2)',
                            'rgba(114, 172, 209, 0.4)', 'rgba(114, 172, 209, 0.6)',
                            'rgba(114, 172, 209, 0.8)', 'rgba(114, 172, 209, 1)'],
                            shadowColor: 'rgba(0, 0, 0, 0.3)',
                            shadowBlur: 10
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.5)'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.5)'
                        }
                    }
                }
            ],
            series: [
                {
                    name: '雷达图',
                    type: 'radar',
                    itemStyle: {
                        emphasis: {
                            lineStyle: {
                                width: 4
                            }
                        }
                    },
                    data: this.visualizedData
                }
            ]
        });
    }
  }
}
</script>
