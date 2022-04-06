import React from "react";
import { Menu } from "antd";
import Link from "next/link";
import {
  AreaChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
} from "@ant-design/icons";

function Sidebar() {
  return (
    <div className="side-nav">
      <Menu mode="inline" theme="dark">
        <Menu.Item key="1" icon={<AreaChartOutlined />}>
          <Link href="/">Indicators</Link>
        </Menu.Item>

        <Menu.Item key="2" icon={<DesktopOutlined />}>
          <Link href="/strength"> Strength</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
}

export default Sidebar;
