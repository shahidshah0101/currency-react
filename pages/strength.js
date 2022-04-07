import React, { useState, useEffect } from "react";
import Head from "next/head";
import {
  Form,
  Button,
  DatePicker,
  Spin,
  Row,
  Col,
  Checkbox,
  Input,
} from "antd";
import "antd/dist/antd.css";
import Sidebar from "../components/Sidebar";
import anychart from "anychart";
import axios from "axios";

export default function Strength() {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([]);
  const [startRatio, setStartRatio] = useState(0);
  const [endRatio, setEndRatio] = useState(1);

  var chartAnalog;
  var chartDigital;

  const { RangePicker } = DatePicker;

  const currencyOptions = [
    "EUR",
    "GBP",
    "JPY",
    "USD",
    "CHF",
    "CAD",
    "AUD",
    "NZD",
  ];
  const timeframeOptions = ["M15", "M30", "M60", "M240"];

  function onChangeDate(value, dateString) {
    setDateRange(dateString);
  }
  const applyFilters = (values) => {
    //console.log("values", values);
    var dateFrom = "";
    var dateTo = "";
    if (dateRange.length > 0) {
      console.log(dateRange[0]);
      dateFrom = dateRange[0];
      dateTo = dateRange[1];
    }
    setLoading(true);
    const analogData = {
      timeframe: values.timeframe,
      currency: values.currency,
      signal_type: "analog",
      to: dateTo,
      from: dateFrom,
    };
    const digitalData = {
      timeframe: values.timeframe,
      currency: values.currency,
      signal_type: "digital",
      to: dateTo,
      from: dateFrom,
    };
    //return false;

    axios({
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: `${process.env.API_URL}strength_data`,
      data: analogData,
    })
      .then((analogResponse) => {
        analogChart(analogResponse);
        // setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });

    axios({
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: `${process.env.API_URL}strength_data`,
      data: digitalData,
    })
      .then((digitalResponse) => {
        digitalChart(digitalResponse);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  // =========== Analog Chart Start ==============
  const analogChart = (res) => {
    var offset = new Date().getTimezoneOffset();
    anychart.format.outputTimezone(offset);
    const timeframeKey = Object.keys(res.data);
    //console.log("timeframeKey", timeframeKey);
    chartAnalog = anychart.line();
    var chart = anychart.line();

    var scroller = chart.xScroller();
    scroller.enabled(true);

    chart.animation(true);
    chart.crosshair().enabled(true).yLabel(false).yStroke(null);
    chart.tooltip().positionMode("point");
    chart.xAxis().labels().padding(0).rotation(90);
    chart.legend().enabled(true).fontSize(13).padding([0, 0, 10, 0]);

    var arraycontainsM15 = timeframeKey.indexOf("M15") > -1;
    var arraycontainsM30 = timeframeKey.indexOf("M30") > -1;
    var arraycontainsM60 = timeframeKey.indexOf("M60") > -1;
    var arraycontainsM240 = timeframeKey.indexOf("M240") > -1;

    if (arraycontainsM15) {
      var dataSetM15 = anychart.data.set(res.data["M15"].data["analog"]);
      for (var i = 0; i < res.data["M15"].data["currencies"].length; i++) {
        console.log(i);
        let data = res.data["M15"].data["currencies"][i];
        var firstSeriesDataM15 = dataSetM15.mapAs({ x: 0, value: 1 + i });
        var firstSeriesM15 = chart.line(firstSeriesDataM15);
        firstSeriesM15.name("M15-" + data);
        firstSeriesM15.hovered().markers().enabled(true).type("circle").size(4);
        firstSeriesM15.tooltip().position("right").anchor("left-center");
      }
    }
    if (arraycontainsM30) {
      var dataSetM30 = anychart.data.set(res.data["M30"].data["analog"]);
      for (var i = 0; i < res.data["M30"].data["currencies"].length; i++) {
        console.log(i);
        let data = res.data["M30"].data["currencies"][i];
        var firstSeriesDataM30 = dataSetM30.mapAs({ x: 0, value: 1 + i });
        var firstSeriesM30 = chart.stepLine(firstSeriesDataM30);
        firstSeriesM30.name("M30-" + data);
        firstSeriesM30.hovered().markers().enabled(true).type("circle").size(4);
        firstSeriesM30.tooltip().position("right").anchor("left-center");
        firstSeriesM30.stepDirection("forward");
      }
    }
    if (arraycontainsM60) {
      var dataSetM60 = anychart.data.set(res.data["M60"].data["analog"]);
      for (var i = 0; i < res.data["M60"].data["currencies"].length; i++) {
        console.log(i);
        let data = res.data["M60"].data["currencies"][i];
        var firstSeriesDataM60 = dataSetM60.mapAs({ x: 0, value: 1 + i });
        var firstSeriesM60 = chart.stepLine(firstSeriesDataM60);
        firstSeriesM60.name("M60-" + data);
        firstSeriesM60.hovered().markers().enabled(true).type("circle").size(4);
        firstSeriesM60.tooltip().position("right").anchor("left-center");
        firstSeriesM60.stepDirection("forward");
      }
    }
    if (arraycontainsM240) {
      var dataSetM240 = anychart.data.set(res.data["M240"].data["analog"]);
      for (var i = 0; i < res.data["M240"].data["currencies"].length; i++) {
        //console.log(i);
        let data = res.data["M240"].data["currencies"][i];
        var firstSeriesDataM240 = dataSetM240.mapAs({ x: 0, value: 1 + i });
        var firstSeriesM240 = chart.stepLine(firstSeriesDataM240);
        firstSeriesM240.name("M240-" + data);
        firstSeriesM240
          .hovered()
          .markers()
          .enabled(true)
          .type("circle")
          .size(4);
        firstSeriesM240.tooltip().position("right").anchor("left-center");
        firstSeriesM240.stepDirection("forward");
      }
    }

    const myNode = document.getElementById("analogContainer");
    myNode.innerHTML = "";
    chart.container("analogContainer");

    // initiate chart drawing
    chart.xScroller().listen("scrollerchangefinish", function (e) {
      var startRatio = e.startRatio;
      var endRatio = e.endRatio;
      setStartRatio(startRatio);
      setEndRatio(endRatio);
      var xZoom = chartDigital.xZoom();

      xZoom.setTo(startRatio, endRatio);
    });
    chartAnalog = chart;
    chartAnalog.draw();

    // set container id for the chart
  };
  // =========== Analog Chart End ================

  // =========== Digital Chart End ================
  const digitalChart = (res) => {
    var offset = new Date().getTimezoneOffset();
    anychart.format.outputTimezone(offset);
    const timeframeKey = Object.keys(res.data);
    //console.log("timeframeKey", timeframeKey);
    var chart = anychart.line();
    chartDigital = anychart.line();

    chart.animation(true);
    chart.crosshair().enabled(true).yLabel(false).yStroke(null);
    chart.tooltip().positionMode("point");
    chart.xAxis().labels().padding(0).rotation(90);
    chart.legend().enabled(true).fontSize(13).padding([0, 0, 10, 0]);

    var arraycontainsM15 = timeframeKey.indexOf("M15") > -1;
    var arraycontainsM30 = timeframeKey.indexOf("M30") > -1;
    var arraycontainsM60 = timeframeKey.indexOf("M60") > -1;
    var arraycontainsM240 = timeframeKey.indexOf("M240") > -1;

    if (arraycontainsM15) {
      var dataSetM15 = anychart.data.set(res.data["M15"].data["digital"]);
      for (var i = 0; i < res.data["M15"].data["currencies"].length; i++) {
        console.log(i);
        let data = res.data["M15"].data["currencies"][i];
        var firstSeriesDataM15 = dataSetM15.mapAs({ x: 0, value: 1 + i });
        var firstSeriesM15 = chart.line(firstSeriesDataM15);
        firstSeriesM15.name("M15-" + data);
        firstSeriesM15.hovered().markers().enabled(true).type("circle").size(4);
        firstSeriesM15.tooltip().position("right").anchor("left-center");
      }
    }
    if (arraycontainsM30) {
      var dataSetM30 = anychart.data.set(res.data["M30"].data["digital"]);
      for (var i = 0; i < res.data["M30"].data["currencies"].length; i++) {
        console.log(i);
        let data = res.data["M30"].data["currencies"][i];
        var firstSeriesDataM30 = dataSetM30.mapAs({ x: 0, value: 1 + i });
        var firstSeriesM30 = chart.stepLine(firstSeriesDataM30);
        firstSeriesM30.name("M30-" + data);
        firstSeriesM30.hovered().markers().enabled(true).type("circle").size(4);
        firstSeriesM30.tooltip().position("right").anchor("left-center");
        firstSeriesM30.stepDirection("forward");
      }
    }
    if (arraycontainsM60) {
      var dataSetM60 = anychart.data.set(res.data["M60"].data["digital"]);
      for (var i = 0; i < res.data["M60"].data["currencies"].length; i++) {
        console.log(i);
        let data = res.data["M60"].data["currencies"][i];
        var firstSeriesDataM60 = dataSetM60.mapAs({ x: 0, value: 1 + i });
        var firstSeriesM60 = chart.stepLine(firstSeriesDataM60);
        firstSeriesM60.name("M60-" + data);
        firstSeriesM60.hovered().markers().enabled(true).type("circle").size(4);
        firstSeriesM60.tooltip().position("right").anchor("left-center");
        firstSeriesM60.stepDirection("forward");
      }
    }
    if (arraycontainsM240) {
      var dataSetM240 = anychart.data.set(res.data["M240"].data["digital"]);
      for (var i = 0; i < res.data["M240"].data["currencies"].length; i++) {
        // console.log(i);
        let data = res.data["M240"].data["currencies"][i];
        var firstSeriesDataM240 = dataSetM240.mapAs({ x: 0, value: 1 + i });
        var firstSeriesM240 = chart.stepLine(firstSeriesDataM240);
        firstSeriesM240.name("M240-" + data);
        firstSeriesM240
          .hovered()
          .markers()
          .enabled(true)
          .type("circle")
          .size(4);
        firstSeriesM240.tooltip().position("right").anchor("left-center");
        firstSeriesM240.stepDirection("forward");
      }
    }

    const myNode = document.getElementById("digitalContainer");
    myNode.innerHTML = "";
    chart.container("digitalContainer");
    // initiate chart drawing

    chartDigital = chart;
    chartDigital.draw();

    // set container id for the chart
  };
  // =========== Digital Chart End ================

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
          <Spin tip="Loading..." spinning={loading}>
            <div className="white-box">
              <div className="filters">
                <Form
                  name="horizontal_fitlers"
                  layout="inline"
                  onFinish={applyFilters}
                  initialValues={{
                    signal_type: "analog",
                  }}
                >
                  <div className="currency-checkboxes">
                    <Form.Item label="Date Time" name="date">
                      <RangePicker
                        showTime
                        onChange={onChangeDate}
                        style={{ width: "300px" }}
                      />
                    </Form.Item>
                    <b>Currency: &nbsp;&nbsp;</b>
                    <Form.Item name="currency">
                      <Checkbox.Group options={currencyOptions} />
                    </Form.Item>
                  </div>
                  <div className="currency-checkboxes">
                    <b>Timeframe: &nbsp;&nbsp;</b>
                    <Form.Item name="timeframe">
                      <Checkbox.Group options={timeframeOptions} />
                    </Form.Item>
                    <Form.Item name="signal_type" style={{ display: "none" }}>
                      <Input type="text" />
                    </Form.Item>
                  </div>

                  <Button type="primary" htmlType="submit">
                    Apply Filters
                  </Button>
                </Form>
              </div>
            </div>
            <Row gutter={16}>
              <Col span={24}>
                <div className="white-box">
                  <span className="ribbon4">Analog</span>
                  <div id="analogContainer" className="half-container"></div>
                </div>
              </Col>
              <Col span={24}>
                <div className="white-box">
                  <span className="ribbon4">Digital</span>
                  <div id="digitalContainer" className="half-container"></div>
                </div>
              </Col>
            </Row>
          </Spin>
        </div>
      </main>
    </div>
  );
}
