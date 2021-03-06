import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Form, Button, Select, DatePicker, Spin, Checkbox } from "antd";
import "antd/dist/antd.css";
import Sidebar from "../components/Sidebar";
import anychart from "anychart";
import axios from "axios";
import moment from "moment";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([]);
  const [dateRangeFrom, setDateRangeFrom] = useState([]);
  const [dateRangeTo, setDateRangeTo] = useState([]);
  const [plotGlobal, setPlotGlobal] = useState(null);
  const [chartData, setChartData] = useState(null);
  const filterAnotation = [
    { label: "Candlestick Patterns", value: "H/I" },
    { label: "Extreme Points", value: "extremePoints" },
    { label: "Levels", value: "levels" },
    { label: "Trends", value: "trends" },
  ];

  const { Option } = Select;
  const { RangePicker } = DatePicker;

  function onChangeDateFrom(value, dateStringFrom) {
    let dateFrom = dateStringFrom + " " + "00:00:00";
    setDateRangeFrom(dateFrom);
  }
  function onChangeDateTo(value, dateStringTo) {
    let dateTo = dateStringTo + " " + "00:00:00";
    setDateRangeTo(dateTo);
  }
  function disabledDate(current) {
    let dateFrom = "2010-01-08 04:00:00";
    let dateTo = "2021-12-31 16:00:00";
    return (
      (current && current < moment(dateFrom, "YYYY-MM-DD HH:mm:ss")) ||
      current > moment(dateTo, "YYYY-MM-DD HH:mm:ss")
    );
  }

  useEffect(() => {});
  const onFinish = (values) => {
    var annotationsArray = [];
    console.log(values.annotations);
    for (var i = 0; i < values.annotations.length; i++) {
      if (values.annotations[i] === "H/I") {
        annotationsArray.push("H/I");
      }
      if (values.annotations[i] === "extremePoints") {
        annotationsArray.push("Highs", "Lows");
      }
      if (values.annotations[i] === "levels") {
        annotationsArray.push("Support", "Resistance");
      }
      if (values.annotations[i] === "trends") {
        annotationsArray.push("HighsTrends", "LowsTrends");
      }
    }

    setLoading(true);
    const formData = {
      currency: values.currencies,
      dataset: values.dataset,
      model: values.model,
      timeframe: values.timeframe,
      from: dateRangeFrom,
      to: dateRangeTo,
      annotations: annotationsArray,
    };

    axios({
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: `${process.env.API_URL}dataset`,
      data: formData,
    })
      .then((res) => {
        //============== Chart Data ==================
        const currencyKeyArray = Object.keys(res.data.data);
        const currencyKey = currencyKeyArray[0];
        var result = res.data.data[currencyKey];
        setChartData(res.data);
        // console.log("check", chartData);
        //==============  Resistance Data ==================
        var resistance = [];
        if (res.data.resistance) {
          const resistanceKeyArray = Object.keys(res.data.resistance);
          const resistanceKey = resistanceKeyArray[0];
          resistance = res.data.resistance[resistanceKey];
        }

        //==============  Support Data ==================
        var support = [];
        if (res.data.support) {
          const supportKeyArray = Object.keys(res.data.support);
          const supportKey = supportKeyArray[0];
          support = res.data.support[supportKey];
        }

        var up_trend = [];
        if (res.data.up_trend) {
          const upTrendKeyArray = Object.keys(res.data.up_trend);
          const upTrendKey = upTrendKeyArray[0];
          up_trend = res.data.up_trend[upTrendKey];
        }
        var down_trend = [];
        if (res.data.down_trend) {
          const downTrendKeyArray = Object.keys(res.data.down_trend);
          const downTrendKey = downTrendKeyArray[0];
          down_trend = res.data.down_trend[downTrendKey];
        }

        //  console.log("rr", resistance);
        // ============= Chart Configuration ==========
        var offset = new Date().getTimezoneOffset();
        anychart.format.outputTimezone(offset);
        var dataTable = anychart.data.table();

        var simpleHammer = [];
        var invertedHammer = [];
        var chart = anychart.stock();
        var plot = chart.plot(0);
        setPlotGlobal(plot);
        var annotationPeaks = plot.annotations();
        var controller = plot.annotations();

        // ============= Chart Configuration ==========

        for (let i = 0; i < result.length - 1; i++) {
          let data = result[i];
          var candleData = [
            data["datetime"],
            data["ADX"],
            data["ADX_LABEL"],
            data["ATR"],
            data["BBANDS_LOWER"],
            data["BBANDS_MIDDLE"],
            data["BBANDS_UPPER"],
            data["CANDLE_LABEL"],
            data["CLOSE"],
            data["COUNT"],
            data["HAMMER"],
            data["HIGH"],
            data["INVERTED_HAMMER"],
            data["LABEL"],
            data["LOW"],
            data["MA_FAST"],
            data["MA_SLOW"],
            data["MINUS_DI"],
            data["OPEN"],
            data["PLUS_DI"],
            data["RSI"],
            data["RSI_LABEL"],
            data["STOCH_SLOWD"],
            data["STOCH_SLOWK"],
            data["PEAK"],
            data["BOTTOM"],
            data["CANDLE_NUM"],
            data["PEAK_TREND_DISTANCE"] !== "None"
              ? data["PEAK_TREND_DISTANCE"]
              : 0,
            data["BOTTOM_TREND_DISTANCE"] !== "None"
              ? data["BOTTOM_TREND_DISTANCE"]
              : 0,
          ];
          //  console.log("candledata", candleData);

          dataTable.addData([candleData]);

          if (data["PEAK"] > 0) {
            // console.log("PEAK", data["PEAK"]);
            annotationPeaks
              .marker()
              .xAnchor(data["datetime"])
              .valueAnchor(data["HIGH"])
              //.fill('green 0.5')
              .stroke("2 green 0.75")
              .markerType("arrow-down");
            // .allowEdit(false);
          } else if (data["BOTTOM"] > 0) {
            //console.log("BOTTOM", data["BOTTOM"]);
            annotationPeaks
              .marker()
              .xAnchor(data["datetime"])
              .valueAnchor(data["LOW"])
              //   .fill('red 0.5')
              .stroke("2 #1890ff 0.75")
              .allowEdit(false);
          }
          plot.eventMarkers();
          if (data["HAMMER"] == "100") {
            const hammerData = {
              date: data["datetime"],
              description: "HAMMER " + data["datetime"],
            };
            simpleHammer.push(hammerData);
          } else if (data["INVERTED_HAMMER"] == "100") {
            const hammerData = {
              date: data["datetime"],
              description: "INVERTED_HAMMER " + data["datetime"],
            };
            invertedHammer.push(hammerData);
          }
        }

        //==================== Resistance & Support ======================
        if (resistance.length > 0) {
          for (var i = 0; i < resistance.length; i++) {
            var rStartValue = resistance[i]["RESISTANCE_START_VALUE"];
            var rEndValue = resistance[i]["RESISTANCE_END_VALUE"];
            controller
              .line({
                xAnchor: resistance[i]["RESISTANCE_START"],
                valueAnchor: rStartValue,
                secondXAnchor: resistance[i]["RESISTANCE_END"],
                secondValueAnchor: rEndValue,
                normal: { stroke: "1 green" },
              })
              .allowEdit(false);
          }
        }
        if (support.length > 0) {
          for (var i = 0; i < support.length; i++) {
            var sStartValue = support[i]["SUPPORT_START_VALUE"];
            var sEndValue = support[i]["SUPPORT_END_VALUE"];
            controller
              .line({
                xAnchor: support[i]["SUPPORT_START"],
                valueAnchor: sStartValue,
                secondXAnchor: support[i]["SUPPORT_END"],
                secondValueAnchor: sEndValue,
                normal: { stroke: "1 #1890ff" },
              })
              .allowEdit(false);
          }
        }
        //==================== Resistance & Support ======================

        //==================== Trends ======================
        if (up_trend.length > 0) {
          for (var i = 0; i < up_trend.length; i++) {
            var data = up_trend[i];
            controller
              .line({
                xAnchor: data["PEAK_TREND_START"],
                valueAnchor: data["PEAK_TREND_START_VALUE"],
                secondXAnchor: data["PEAK_TREND_END"],
                secondValueAnchor: data["PEAK_TREND_END_VALUE"],
              })
              .allowEdit(false)
              .stroke({ color: "green" });

            controller
              .line({
                xAnchor: data["PEAK_TREND_END"],
                valueAnchor: data["PEAK_TREND_END_VALUE"],
                secondXAnchor: data["PEAK_TREND_EXTENDED"],
                secondValueAnchor: data["PEAK_TREND_EXTENDED_VALUE"],
              })
              .allowEdit(false)
              .stroke({ color: "green", dash: "4 3" });
          }
        }
        if (down_trend.length > 0) {
          for (var i = 0; i < down_trend.length; i++) {
            var data = down_trend[i];
            controller
              .line({
                xAnchor: data["BOTTOM_TREND_START"],
                valueAnchor: data["BOTTOM_TREND_START_VALUE"],
                secondXAnchor: data["BOTTOM_TREND_END"],
                secondValueAnchor: data["BOTTOM_TREND_END_VALUE"],
              })
              .allowEdit(false)
              .stroke({ color: "red" });

            controller
              .line({
                xAnchor: data["BOTTOM_TREND_END"],
                valueAnchor: data["BOTTOM_TREND_END_VALUE"],
                secondXAnchor: data["BOTTOM_TREND_EXTENDED"],
                secondValueAnchor: data["BOTTOM_TREND_EXTENDED_VALUE"],
              })
              .allowEdit(false)
              .stroke({ color: "red", dash: "4 3" });
          }
        }
        //==================== Trends ======================

        plot.eventMarkers({
          groups: [
            {
              format: "H",
              data: simpleHammer,
            },
            {
              format: "I",
              data: invertedHammer,
            },
          ],
        });

        var mapping = dataTable.mapAs();
        mapping.addField("ADX", 1, "ADX");
        mapping.addField("ADX_LABEL", 2, "ADX_LABEL");
        mapping.addField("ATR", 3, "ATR");
        mapping.addField("BBANDS_LOWER", 4, "BBANDS_LOWER");
        mapping.addField("BBANDS_MIDDLE", 5, "BBANDS_MIDDLE");
        mapping.addField("BBANDS_UPPER", 6, "BBANDS_UPPER");
        mapping.addField("CANDLE_LABEL", 7, "CANDLE_LABEL");
        mapping.addField("close", 8, "close");
        mapping.addField("COUNT", 9, "COUNT");
        mapping.addField("HAMMER", 10, "HAMMER");
        mapping.addField("high", 11, "high");
        mapping.addField("INVERTED_HAMMER", 12, "INVERTED_HAMMER");
        mapping.addField("LABEL", 13, "LABEL");
        mapping.addField("low", 14, "low");
        mapping.addField("MA_FAST", 15, "MA_FAST");
        mapping.addField("MA_SLOW", 16, "MA_SLOW");
        mapping.addField("MINUS_DI", 17, "MINUS_DI");
        mapping.addField("open", 18, "open");
        mapping.addField("PLUS_DI", 19, "PLUS_DI");
        mapping.addField("RSI", 20, "RSI");
        mapping.addField("RSI_LABEL", 21, "RSI_LABEL");
        mapping.addField("STOCH_SLOWD", 22, "STOCH_SLOWD");
        mapping.addField("STOCH_SLOWK", 23, "STOCH_SLOWK");
        mapping.addField("PEAK", 24, "PEAK");
        mapping.addField("BOTTOM", 25, "BOTTOM");
        mapping.addField("CANDLE_NUM", 26, "CANDLE_NUM");
        mapping.addField("PEAK_TREND_DISTANCE", 27, "PEAK_TREND_DISTANCE");
        mapping.addField("BOTTOM_TREND_DISTANCE", 28, "BOTTOM_TREND_DISTANCE");

        var serires = plot.candlestick(mapping);

        serires.name("Candles");
        serires
          .tooltip()
          .format(
            `\nOpen???{%open}\nHigh???{%high}\nLow???{%low}\nClose???{%close}\nCANDLE_NUM???{%CANDLE_NUM}`
          );
        plot
          .line(dataTable.mapAs({ value: 4 }))
          .stroke("1 #0ce3ac")
          .name("BBANDS_LOWER")
          .enabled(false);
        plot
          .line(dataTable.mapAs({ value: 5 }))
          .stroke("1 #ffb00b")
          .name("BBANDS_MIDDLE")
          .enabled(false);
        plot
          .line(dataTable.mapAs({ value: 6 }))
          .stroke("1 #ff4200")
          .name("BBANDS_UPPER")
          .enabled(false);

        plot
          .line(dataTable.mapAs({ value: 15 }))
          .stroke("1 #33ccee")
          .name("MA_FAST")
          .enabled(false);
        plot
          .line(dataTable.mapAs({ value: 16 }))
          .stroke("1 #523a28")
          .name("MA_SLOW")
          .enabled(false);

        chart.splitters().normal().stroke({
          color: "red",
          dash: "3 4",
          thickness: 2,
          opacity: 0.9,
        });
        chart.splitters().hovered().stroke({
          color: "blue",
          dash: "3 4",
          thickness: 2,
          opacity: 0.9,
        });
        chart.splitters().preview().fill({
          color: "green",
          opacity: 0.5,
        });

        // create line series with mapping
        var bottomLines = chart.plot(1);
        plot.height("85%");
        bottomLines.height("15%");
        var padding = chart.padding();

        padding.top(0);

        var adxplot = dataTable.mapAs({ value: 1 });
        var adxline = chart.plot(1).line(adxplot);
        adxline.name("ADX");
        adxline.stroke("#1ed760 0.9");
        // adxline.enabled(false);

        var minusDIPLot = dataTable.mapAs({ value: 17 });
        var minusDIline = chart.plot(1).line(minusDIPLot);
        minusDIline.name("MINUS_DI");
        minusDIline.stroke("#ffd97c 0.9");
        // minusDIline.enabled(false);

        var plusDIPLot = dataTable.mapAs({ value: 19 });
        var plusDIline = chart.plot(1).line(plusDIPLot);
        plusDIline.name("PLUS_DI");
        plusDIline.stroke("red 0.9");
        // plusDIline.enabled(false);

        var stochplot = dataTable.mapAs({ value: 22 });
        var stochplotline = chart.plot(1).line(stochplot);
        stochplotline.name("STOCH_SLOWD");
        stochplotline.stroke("#3d5954 0.9");
        // stochplotline.enabled(false);

        var stochslowkplot = dataTable.mapAs({ value: 23 });
        var stochslowline = chart.plot(1).line(stochslowkplot);
        stochslowline.name("STOCH_SLOWK");
        stochslowline.stroke("#fcafac 0.9");
        //stochslowline.enabled(false);

        var legend = chart.plot(1).legend();
        legend.listen("legendItemClick", function (e) {
          var index = e["itemIndex"];
          console.log(index);
          if (index === 0) {
            minusDIline.enabled(!minusDIline.enabled());
            plusDIline.enabled(!plusDIline.enabled());
          } else if (index === 3) {
            stochslowline.enabled(!stochslowline.enabled());
          }
        });

        var atrplot = dataTable.mapAs({ value: 3 });
        var atrline = chart.plot(1).line(atrplot);
        atrline.name("ATR");
        atrline.stroke("#013179 0.9");
        atrline.enabled(false);

        var rsi = dataTable.mapAs({ value: 20 });
        var rsiline = chart.plot(1).line(rsi);
        rsiline.name("RSI");
        rsiline.stroke("#ad6bd3 0.9");
        rsiline.enabled(false);

        var peakplot = dataTable.mapAs({ value: 24 });
        var peaklowline = chart.plot(1).line(peakplot);
        peaklowline.name("PEAK");
        peaklowline.stroke("#444 0.9");
        peaklowline.enabled(false);

        var bottomplot = dataTable.mapAs({ value: 25 });
        var bottomlowline = chart.plot(1).line(bottomplot);
        bottomlowline.name("BOTTOM");
        bottomlowline.stroke("#000 0.9");
        bottomlowline.enabled(false);

        var upTrendAngleplot = dataTable.mapAs({ value: 27 });
        var upTrendAngleline = chart.plot(1).line(upTrendAngleplot);
        upTrendAngleline.name("PEAK_TREND_DISTANCE");
        upTrendAngleline.stroke("#000 0.9");
        upTrendAngleline.enabled(false);

        var downTrendAngleplot = dataTable.mapAs({ value: 28 });
        var downTrendAngleline = chart.plot(1).line(downTrendAngleplot);
        downTrendAngleline.name("BOTTOM_TREND_DISTANCE");
        downTrendAngleline.stroke("#000 0.9");
        downTrendAngleline.enabled(false);

        const myNode = document.getElementById("container");
        myNode.innerHTML = "";
        //chart.container("container");
        if (!chart.container()) chart.container("container");
        plot.yGrid(false).xGrid(false).yMinorGrid(false).xMinorGrid(false);
        var crosshair = chart.crosshair();
        crosshair.enabled(true);

        // Set display mode.
        crosshair.displayMode("float");

        chart.contextMenu().itemsFormatter(function (items) {
          (items["hide-grid"] = {
            text: "Hide Grid",
            action: function () {
              plot
                .yGrid(false)
                .xGrid(false)
                .yMinorGrid(false)
                .xMinorGrid(false);
            },
          }),
            (items["show-item"] = {
              text: "Show Grid",
              action: function () {
                plot.yGrid(true).xGrid(true).yMinorGrid(true).xMinorGrid(true);
              },
            });
          return items;
        });

        chart.draw();

        // plot.area(mapping).name("Candles");

        var rangePicker = anychart.ui.rangePicker();
        rangePicker.render(chart);
        var rangeSelector = anychart.ui.rangeSelector();
        rangeSelector.render(chart);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <div>
      <Head>
        <title>Luccrostrength</title>
        <meta name="Luccrostrength" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdn.anychart.com/releases/8.3.0/css/anychart-ui.min.css"
        />
      </Head>

      <main className="dashboard">
        <Sidebar />
        <div className="main-content">
          <div className="white-box filters">
            <Form
              name="horizontal_login"
              layout="inline"
              initialValues={{
                currencies: "EUR_USD",
                dataset: "train",
                model: "CNN_NEW_TDC",
                timeframe: "M240",
                annotations: ["extremePoints", "trends"],
              }}
              onFinish={onFinish}
            >
              <Form.Item label="Currencies" name="currencies">
                <Select
                  showSearch
                  placeholder="Select"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  style={{ width: "110px" }}
                >
                  <Option value="GBP_JPY">GBP_JPY</Option>
                  <Option value="EUR_USD">EUR_USD</Option>
                  <Option value="NZD_USD">NZD_USD</Option>
                  <Option value="USD_CHF">USD_CHF</Option>
                  <Option value="AUD_CHF">AUD_CHF</Option>
                  <Option value="CAD_CHF">CAD_CHF</Option>
                  <Option value="AUD_NZD">AUD_NZD</Option>
                  <Option value="NZD_CHF">NZD_CHF</Option>
                  <Option value="CHF_JPY">CHF_JPY</Option>
                  <Option value="NZD_CAD">NZD_CAD</Option>
                  <Option value="NZD_JPY">NZD_JPY</Option>
                  <Option value="GBP_CAD">GBP_CAD</Option>
                  <Option value="EUR_CAD">EUR_CAD</Option>
                  <Option value="EUR_GBP">EUR_GBP</Option>
                  <Option value="GBP_AUD">GBP_AUD</Option>
                  <Option value="EUR_JPY">EUR_JPY</Option>
                  <Option value="AUD_USD">AUD_USD</Option>
                  <Option value="GBP_CHF">GBP_CHF</Option>
                  <Option value="GBP_NZD">GBP_NZD</Option>
                  <Option value="GBP_USD">GBP_USD</Option>
                  <Option value="USD_CAD">USD_CAD</Option>
                  <Option value="USD_JPY">USD_JPY</Option>
                  <Option value="EUR_CHF">EUR_CHF</Option>
                  <Option value="AUD_JPY">AUD_JPY</Option>
                  <Option value="EUR_AUD">EUR_AUD</Option>
                  <Option value="EUR_NZD">EUR_NZD</Option>
                  <Option value="CAD_JPY">CAD_JPY</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Dataset" name="dataset">
                <Select style={{ width: "80px" }}>
                  <Option value="train">train</Option>
                  <Option value="test">test</Option>
                  <Option value="valid">valid</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Model" name="model">
                <Select style={{ width: "150px" }}>
                  <Option value="CNN_NEW_TDC">CNN_NEW_TDC</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Time Frames" name="timeframe">
                <Select style={{ width: "80px" }}>
                  <Option value="M15">M15</Option>
                  <Option value="M30">M30</Option>
                  <Option value="M60">M60</Option>
                  <Option value="M240">M240</Option>
                  <Option value="M1440">M1440</Option>
                </Select>
              </Form.Item>
              <Form.Item label="From" name="datefrom">
                <DatePicker
                  disabledDate={disabledDate}
                  onChange={onChangeDateFrom}
                />
              </Form.Item>
              <Form.Item label="To" name="dateto">
                <DatePicker
                  disabledDate={disabledDate}
                  onChange={onChangeDateTo}
                />
              </Form.Item>
              <Form.Item label="Annotations" name="annotations">
                <Checkbox.Group options={filterAnotation} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
          <Spin tip="Loading..." spinning={loading}>
            <div className="white-box">
              <div id="container" className="chart-container"></div>
            </div>
          </Spin>
        </div>
      </main>
    </div>
  );
}
