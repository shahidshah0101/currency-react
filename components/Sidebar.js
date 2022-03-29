import React from "react";
import { Menu } from "antd";
import {
  AreaChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
} from "@ant-design/icons";

function Sidebar() {
  return (
    <div className="side-nav">
      <Menu defaultSelectedKeys={["1"]} mode="inline" theme="dark">
        <Menu.Item key="1" icon={<AreaChartOutlined />}>
          Intial Dataset
        </Menu.Item>
        <Menu.Item key="2" icon={<DesktopOutlined />}>
          Analysis
        </Menu.Item>
        <Menu.Item key="3" icon={<ContainerOutlined />}>
          Result
        </Menu.Item>
      </Menu>
    </div>
  );
}

export default Sidebar;
