import { Scene, LineLayer } from '@antv/l7'
import { GaodeMap } from '@antv/l7-maps'
import { getLanguage } from '@/lang'

export function baseFlowMapOption(chartDom, chartId, chart, action) {
  const xAxis = JSON.parse(chart.xaxis)
  const xAxisExt = JSON.parse(chart.xaxisExt)
  let customAttr
  if (chart.customAttr) {
    customAttr = JSON.parse(chart.customAttr)
  }
  const size = customAttr.size
  const color = customAttr.color
  const mapStyle = `amap://styles/${color.mapStyle}`
  const lang = getLanguage().includes('zh') ? 'zh' : 'en'
  let init = false
  if (!chartDom) {
    chartDom = new Scene({
      id: chartId,
      map: new GaodeMap({
        lang: lang,
        pitch: size.mapPitch,
        style: mapStyle
      }),
      logoVisible: false
    })
    init = true
  }
  if (xAxis?.length < 2 || xAxisExt?.length < 2) {
    return chartDom
  }
  chartDom.removeAllLayer()
    .then(() => {
      const lineLayer = new LineLayer({
        name: 'line',
        blend: 'normal',
        autoFit: true
      })
        .source(chart.data.tableRow, {
          parser: {
            type: 'json',
            x: xAxis[0].dataeaseName,
            y: xAxis[1].dataeaseName,
            x1: xAxisExt[0].dataeaseName,
            y1: xAxisExt[1].dataeaseName
          }
        })
        .size(size.mapLineWidth)
        .shape(size.mapLineType)
        .animate({
          enable: size.mapLineAnimate,
          interval: size.lineAnimateInterval,
          trailLength: size.lineAnimateTrailLength,
          duration: size.lineAnimateDuration
        })
      if (color.mapLineGradient) {
        lineLayer.style({
          sourceColor: color.mapLineSourceColor,
          targetColor: color.mapLineTargetColor,
          opacity: (color.alpha / 100).toFixed(1)
        })
      } else {
        lineLayer.style({
          opacity: (color.alpha / 100).toFixed(1)
        })
          .color(color.mapLineSourceColor)
      }
      if (!init) {
        chartDom.setPitch(size.mapPitch)
        chartDom.setMapStyle(mapStyle)
        chartDom.addLayer(lineLayer)
      }
      chartDom.on('loaded', () => {
        chartDom.addLayer(lineLayer)
      })
    })
  return chartDom
}