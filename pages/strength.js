import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Form, Button, Select, DatePicker, Spin, Row, Col } from "antd";
import "antd/dist/antd.css";
import Sidebar from "../components/Sidebar";
import anychart from "anychart";
import axios from "axios";

export default function Strength() {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([]);

  const { Option } = Select;
  const { RangePicker } = DatePicker;

  function onChangeDate(value, dateString) {
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
      timeframe: values.timeframe,
      to: dateTo,
      from: dateFrom,
    };
    //return false;
    axios({
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: `${process.env.API_URL}strength_data`,
      data: formData,
    })
      .then((res) => {
        // console.log("res", res);
        // return false;
        const keyArray = Object.keys(res.data.data);
        const analogKey = keyArray[1];
        const digitalKey = keyArray[2];
        var analogData = res.data.data[analogKey];
        var digitalData = res.data.data[digitalKey];
        // ============= Chart Configuration ==========
        var offset = new Date().getTimezoneOffset();
        anychart.format.outputTimezone(offset);
        analogChart(analogData);
        digitalChart(digitalData);
        // ============= Chart Configuration ==========

        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };
  // =========== Analog Chart Start ==============
  const analogChart = (analogData) => {
    var dataSet = anychart.data.set(analogData);
    var firstSeriesData = dataSet.mapAs({ x: 0, value: 1 });
    var secondSeriesData = dataSet.mapAs({ x: 0, value: 2 });
    var thirdSeriesData = dataSet.mapAs({ x: 0, value: 3 });
    var fourthSeriesData = dataSet.mapAs({ x: 0, value: 4 });
    var fifthSeriesData = dataSet.mapAs({ x: 0, value: 5 });
    var sixthSeriesData = dataSet.mapAs({ x: 0, value: 6 });
    var seventhSeriesData = dataSet.mapAs({ x: 0, value: 7 });
    var eightSeriesData = dataSet.mapAs({ x: 0, value: 8 });
    var chart = anychart.line();
    chart.animation(true);
    // turn on the crosshair
    chart.crosshair().enabled(true).yLabel(false).yStroke(null);
    // set tooltip mode to point
    chart.tooltip().positionMode("point");

    chart.xAxis().labels().padding(0).rotation(90);

    // create first series with mapped data
    var firstSeries = chart.line(firstSeriesData);
    firstSeries.name("EUR");
    firstSeries.hovered().markers().enabled(true).type("circle").size(4);
    firstSeries
      .tooltip()
      .position("right")
      .anchor("left-center")
      .offsetX(5)
      .offsetY(5);

    // create second series with mapped data
    var secondSeries = chart.line(secondSeriesData);
    secondSeries.name("GBP");
    secondSeries.hovered().markers().enabled(true).type("circle").size(4);
    secondSeries
      .tooltip()
      .position("right")
      .anchor("left-center")
      .offsetX(5)
      .offsetY(5);

    // create third series with mapped data
    var thirdSeries = chart.line(thirdSeriesData);
    thirdSeries.name("JPY");
    thirdSeries.hovered().markers().enabled(true).type("circle").size(4);
    thirdSeries
      .tooltip()
      .position("right")
      .anchor("left-center")
      .offsetX(5)
      .offsetY(5);

    // create fourth series with mapped data
    var fourthSeries = chart.line(fourthSeriesData);
    fourthSeries.name("USD");
    fourthSeries.hovered().markers().enabled(true).type("circle").size(4);
    fourthSeries
      .tooltip()
      .position("right")
      .anchor("left-center")
      .offsetX(5)
      .offsetY(5);

    // create fifth series with mapped data
    var fifthSeries = chart.line(fifthSeriesData);
    fifthSeries.name("CHF");
    fifthSeries.hovered().markers().enabled(true).type("circle").size(4);
    fifthSeries
      .tooltip()
      .position("right")
      .anchor("left-center")
      .offsetX(5)
      .offsetY(5);

    // create sixth series with mapped data
    var sixthSeries = chart.line(sixthSeriesData);
    sixthSeries.name("CAD");
    sixthSeries.hovered().markers().enabled(true).type("circle").size(4);
    sixthSeries
      .tooltip()
      .position("right")
      .anchor("left-center")
      .offsetX(5)
      .offsetY(5);
    // create seventh series with mapped data
    var seventhSeries = chart.line(seventhSeriesData);
    seventhSeries.name("AUD");
    seventhSeries.hovered().markers().enabled(true).type("circle").size(4);
    seventhSeries
      .tooltip()
      .position("right")
      .anchor("left-center")
      .offsetX(5)
      .offsetY(5);

    // create eight series with mapped data
    var eightSeries = chart.line(eightSeriesData);
    eightSeries.name("NZD");
    eightSeries.hovered().markers().enabled(true).type("circle").size(4);
    eightSeries
      .tooltip()
      .position("right")
      .anchor("left-center")
      .offsetX(5)
      .offsetY(5);

    // turn the legend on
    chart.legend().enabled(true).fontSize(13).padding([0, 0, 10, 0]);

    // set container id for the chart
    const myNode = document.getElementById("analogContainer");
    myNode.innerHTML = "";
    chart.container("analogContainer");
    // initiate chart drawing
    chart.draw();
  };
  // =========== Analog Chart End ================
  // =========== Analog Chart Start ==============
  const digitalChart = (digitalData) => {
    var dataSet = anychart.data.set(digitalData);
    var firstSeriesData = dataSet.mapAs({ x: 0, value: 1 });
    var secondSeriesData = dataSet.mapAs({ x: 0, value: 2 });
    var thirdSeriesData = dataSet.mapAs({ x: 0, value: 3 });
    var fourthSeriesData = dataSet.mapAs({ x: 0, value: 4 });
    var fifthSeriesData = dataSet.mapAs({ x: 0, value: 5 });
    var sixthSeriesData = dataSet.mapAs({ x: 0, value: 6 });
    var seventhSeriesData = dataSet.mapAs({ x: 0, value: 7 });
    var eightSeriesData = dataSet.mapAs({ x: 0, value: 8 });
    var chart = anychart.line();
    chart.animation(true);
    // turn on the crosshair
    chart.crosshair().enabled(true).yLabel(false).yStroke(null);
    // set tooltip mode to point
    chart.tooltip().positionMode("point");

    chart.xAxis().labels().padding(0).rotation(90);

    // create first series with mapped data
    var firstSeries = chart.line(firstSeriesData);
    firstSeries.name("EUR");
    firstSeries.hovered().markers().enabled(true).type("circle").size(4);
    firstSeries
      .tooltip()
      .position("right")
      .anchor("left-center")
      .offsetX(5)
      .offsetY(5);

    // create second series with mapped data
    var secondSeries = chart.line(secondSeriesData);
    secondSeries.name("GBP");
    secondSeries.hovered().markers().enabled(true).type("circle").size(4);
    secondSeries
      .tooltip()
      .position("right")
      .anchor("left-center")
      .offsetX(5)
      .offsetY(5);

    // create third series with mapped data
    var thirdSeries = chart.line(thirdSeriesData);
    thirdSeries.name("JPY");
    thirdSeries.hovered().markers().enabled(true).type("circle").size(4);
    thirdSeries
      .tooltip()
      .position("right")
      .anchor("left-center")
      .offsetX(5)
      .offsetY(5);

    // create fourth series with mapped data
    var fourthSeries = chart.line(fourthSeriesData);
    fourthSeries.name("USD");
    fourthSeries.hovered().markers().enabled(true).type("circle").size(4);
    fourthSeries
      .tooltip()
      .position("right")
      .anchor("left-center")
      .offsetX(5)
      .offsetY(5);

    // create fifth series with mapped data
    var fifthSeries = chart.line(fifthSeriesData);
    fifthSeries.name("CHF");
    fifthSeries.hovered().markers().enabled(true).type("circle").size(4);
    fifthSeries
      .tooltip()
      .position("right")
      .anchor("left-center")
      .offsetX(5)
      .offsetY(5);

    // create sixth series with mapped data
    var sixthSeries = chart.line(sixthSeriesData);
    sixthSeries.name("CAD");
    sixthSeries.hovered().markers().enabled(true).type("circle").size(4);
    sixthSeries
      .tooltip()
      .position("right")
      .anchor("left-center")
      .offsetX(5)
      .offsetY(5);
    // create seventh series with mapped data
    var seventhSeries = chart.line(seventhSeriesData);
    seventhSeries.name("AUD");
    seventhSeries.hovered().markers().enabled(true).type("circle").size(4);
    seventhSeries
      .tooltip()
      .position("right")
      .anchor("left-center")
      .offsetX(5)
      .offsetY(5);

    // create eight series with mapped data
    var eightSeries = chart.line(eightSeriesData);
    eightSeries.name("NZD");
    eightSeries.hovered().markers().enabled(true).type("circle").size(4);
    eightSeries
      .tooltip()
      .position("right")
      .anchor("left-center")
      .offsetX(5)
      .offsetY(5);

    // turn the legend on
    chart.legend().enabled(true).fontSize(13).padding([0, 0, 10, 0]);

    // set container id for the chart
    const myNode = document.getElementById("digitalContainer");
    myNode.innerHTML = "";
    chart.container("digitalContainer");
    // initiate chart drawing
    chart.draw();
  };
  // =========== Analog Chart End ================

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
                timeframe: "M240",
              }}
              onFinish={onFinish}
            >
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
            <Row gutter={16}>
              <Col className="gutter-row" span={12}>
                <div className="white-box">
                  <h2>Analog</h2>
                  <div id="analogContainer" className="half-container"></div>
                </div>
              </Col>
              <Col className="gutter-row" span={12}>
                <div className="white-box">
                  <h2>Digital</h2>
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