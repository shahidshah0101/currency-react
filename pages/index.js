import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Form, Button, Select, DatePicker, Spin } from "antd";
import "antd/dist/antd.css";
import Sidebar from "../components/Sidebar";
import anychart from "anychart";
import axios from "axios";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([]);

  const { Option } = Select;
  const { RangePicker } = DatePicker;
  function onChange(value) {
    console.log(`selected ${value}`);
  }

  function onSearch(val) {
    console.log("search:", val);
  }
  function onChangeDate(value, dateString) {
    console.log("Formatted Selected Time: ", dateString);
    setDateRange(dateString);
  }

  const onFinish = (values) => {
    var dateFrom = "";
    var dateTo = "";
    if (dateRange.length > 0) {
      console.log(dateRange[0]);
      dateFrom = dateRange[0];
      dateTo = dateRange[1];
    }
    setLoading(true);
    const formData = {
      currency: values.currencies,
      dataset: values.dataset,
      model: values.model,
      timeframe: values.timeframe,
      to: dateTo,
      from: dateFrom,
    };
    //return false;
    axios({
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: `${process.env.API_URL}dataset`,
      data: formData,
    })
      .then((res) => {
        const currencyKeyArray = Object.keys(res.data.data);
        const currencyKey = currencyKeyArray[0];
        var result = res.data.data[currencyKey];

        // ============= Chart Configuration ==========
        var offset = new Date().getTimezoneOffset();
        anychart.format.outputTimezone(offset);
        var dataTable = anychart.data.table();
        var markers = [];
        var simpleHammer = [];
        var invertedHammer = [];
        var chart = anychart.stock();
        var plot = chart.plot(0);
        var annotationPeaks = plot.annotations();
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
          ];
          //  console.log("candledata", candleData);

          dataTable.addData([candleData]);

          if (data["PEAK"] > 0) {
            console.log("PEAK", data["PEAK"]);
            annotationPeaks
              .marker()
              .xAnchor(data["datetime"])
              .valueAnchor(data["HIGH"])
              //.fill('green 0.5')
              .stroke("2 green 0.75")
              .markerType("arrow-down")
              .allowEdit(false);
          } else if (data["BOTTOM"] > 0) {
            console.log("BOTTOM", data["BOTTOM"]);
            annotationPeaks
              .marker()
              .xAnchor(data["datetime"])
              .valueAnchor(data["LOW"])
              //   .fill('red 0.5')
              .stroke("2 red 0.75")
              .allowEdit(false);
          }

          if (data["HAMMER"] == "100") {
            const hammerData = {
              date: data["datetime"],
              description: "HAMMER " + data["datetime"],
            };
            simpleHammer.push(hammerData);
            var anchor = {
              xAnchor: data["datetime"],
              valueAnchor: data["OPEN"],
              enabled: true,
              type: "marker",
              //  markerType: "arrowdown",
              offsetY: 30,
              size: 15,
              normal: { fill: "red", stroke: "red" },
            };

            //markers.push(anchor);
          } else if (data["INVERTED_HAMMER"] == "100") {
            const hammerData = {
              date: data["datetime"],
              description: "INVERTED_HAMMER " + data["datetime"],
            };
            invertedHammer.push(hammerData);
            var ancho = {
              xAnchor: data["datetime"],
              valueAnchor: data["OPEN"],
              enabled: true,
              type: "marker",
              markerType: "arrowdown",
              size: 15,
              offsetY: -30,
              normal: { fill: "#0ce3ac", stroke: "#0ce3ac" },
            };

            //markers.push(ancho);
          }
        }
        console.log(simpleHammer);
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

        plot.candlestick(mapping).name("Candles");

        plot.annotations(markers);
        plot.yGrid(true).xGrid(true).yMinorGrid(true).xMinorGrid(true);
        plot
          .line(dataTable.mapAs({ value: 4 }))
          .stroke("3 #0ce3ac")
          .name("BBANDS_LOWER");
        plot
          .line(dataTable.mapAs({ value: 5 }))
          .stroke("3 #ffb00b")
          .name("BBANDS_MIDDLE");
        plot
          .line(dataTable.mapAs({ value: 6 }))
          .stroke("3 #ff4200")
          .name("BBANDS_UPPER");

        plot
          .line(dataTable.mapAs({ value: 15 }))
          .stroke("3 #33ccee")
          .name("MA_FAST");
        plot
          .line(dataTable.mapAs({ value: 16 }))
          .stroke("3 #523a28")
          .name("MA_SLOW");
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
        var adxplot = dataTable.mapAs({ value: 1 });
        var adxline = chart.plot(1).line(adxplot);
        adxline.name("ADX");
        adxline.stroke("#1ed760 0.9");

        var atrplot = dataTable.mapAs({ value: 3 });
        var atrline = chart.plot(1).line(atrplot);
        atrline.name("ATR");
        atrline.stroke("#013179 0.9");

        var rsi = dataTable.mapAs({ value: 20 });
        var rsiline = chart.plot(1).line(rsi);
        rsiline.name("RSI");
        rsiline.stroke("#ad6bd3 0.9");

        var minusDIPLot = dataTable.mapAs({ value: 17 });
        var minusDIline = chart.plot(1).line(minusDIPLot);
        minusDIline.name("MINUS_DI");
        minusDIline.stroke("#ffd97c 0.9");

        var plusDIPLot = dataTable.mapAs({ value: 19 });
        var plusDIline = chart.plot(1).line(plusDIPLot);
        plusDIline.name("PLUS_DI");
        plusDIline.stroke("#bdc29b 0.9");

        var stochplot = dataTable.mapAs({ value: 22 });
        var stochplotline = chart.plot(1).line(stochplot);
        stochplotline.name("STOCH_SLOWD");
        stochplotline.stroke("#3d5954 0.9");

        var stochslowkplot = dataTable.mapAs({ value: 23 });
        var stochslowline = chart.plot(1).line(stochslowkplot);
        stochslowline.name("STOCH_SLOWK");
        stochslowline.stroke("#fcafac 0.9");

        var peakplot = dataTable.mapAs({ value: 24 });
        var peaklowline = chart.plot(1).line(peakplot);
        peaklowline.name("PEAK");
        peaklowline.stroke("#444 0.9");

        var bottomplot = dataTable.mapAs({ value: 25 });
        var bottomlowline = chart.plot(1).line(bottomplot);
        bottomlowline.name("BOTTOM");
        bottomlowline.stroke("#000 0.9");

        const myNode = document.getElementById("container");
        myNode.innerHTML = "";
        //chart.container("container");
        if (!chart.container()) chart.container("container");

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
          <div className="white-box">
            <Form
              name="horizontal_login"
              layout="inline"
              initialValues={{
                currencies: "GBP_JPY",
                dataset: "train",
                model: "CNN_NEW_TDC",
                timeframe: "M240",
              }}
              onFinish={onFinish}
            >
              <Form.Item label="Currencies" name="currencies">
                <Select
                  showSearch
                  placeholder="Select"
                  optionFilterProp="children"
                  onChange={onChange}
                  onSearch={onSearch}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  style={{ width: "120px" }}
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
                <Select style={{ width: "100px" }}>
                  <Option value="M15">M15</Option>
                  <Option value="M30">M30</Option>
                  <Option value="M60">M60</Option>
                  <Option value="M240">M240</Option>
                  <Option value="M1440">M1440</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Date" name="date">
                <RangePicker
                  showTime
                  onChange={onChangeDate}
                  style={{ width: "300px" }}
                />
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
              <h2>Chart</h2>

              <div id="container" className="chart-container"></div>
            </div>
          </Spin>
        </div>
      </main>
    </div>
  );
}
