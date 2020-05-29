<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
    import echarts from 'echarts'

    require('echarts/theme/macarons') // echarts theme
    import resize from './mixins/resize'

    export default {
        name: "GradientChart",
        mixins: [resize],
        props: {
            className: {
                type: String,
                default: 'chart'
            },
            width: {
                type: String,
                default: '100%'
            },
            height: {
                type: String,
                default: '350px'
            },
            item: {
                type: Array,
            },
        },
        data() {
            return {
                chart: null,
            }
        },
        watch: {
            item: {
                deep: true,
                handler(val) {
                    this.setOptions(val)
                }
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.initChart()
            })
        },
        beforeDestroy() {
            if (!this.chart) {
                return
            }
            this.chart.dispose()
            this.chart = null
        },
        methods: {
            initChart() {
                this.chart = echarts.init(this.$el, 'macarons')
                this.setOptions(this.item)
            },
            setOptions(data = []) {
                var dateList = data.map(function (item) {
                    return item[0];
                });
                var valueList = data.map(function (item) {
                    return item[1];
                });
                this.chart.setOption({
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: [{
                        data: dateList
                    }],
                    yAxis: [{
                        splitLine: {show: false}
                    }],
                    grid: {
                        left: 10,
                        right: 20,
                        bottom: 20,
                        top: 30,
                        containLabel: true
                    },
                    series: [{
                        type: 'line',
                        showSymbol: false,
                        data: valueList
                    }]
                })
            }
        }
    }
</script>

<style scoped>

</style>
