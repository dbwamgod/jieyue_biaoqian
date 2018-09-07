<template>
    <div style="width:100%;height:100%;" id="service_request_con"></div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "serviceRequests",
  data() {
    return {
      echartsOption: {
        xAxisData: [],
        seriesData: []
      }
    };
  },
  props: ["option"],
  watch: {
    option: function(val) {
      this.echartsOption = Object.assign({}, val);
      this.echartsInit(this.echartsOption);
    }
  },
  created() {},
  mounted() {
    this.echartsInit(this.echartsOption);
  },
  methods: {
    echartsInit(info) {
      const option = {
        title: {
          text: "磁盘使用量",
          left:'center',
          textStyle: {
            align: "center"
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        grid: {
          top: "13%",
          left: "3%",
          right: "1%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: info.xAxisData
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "磁盘使用量",
            type: "line",
            stack: "磁盘使用量",
            // areaStyle: {
            //   normal: {
            //     color: "#2d8cf0"
            //   }
            // },
            data: info.seriesData
          }
        ]
      };
      const serviceRequestCharts = echarts.init(
        document.getElementById("service_request_con")
      );
      serviceRequestCharts.setOption(option);

      window.addEventListener("resize", function() {
        serviceRequestCharts.resize();
      });
    }
  }
};
</script>