import React from "react";
import "./App.less";
import WebRoutes from "./WebRoutes";
import "antd/dist/antd.less";
import { RecoilRoot } from "recoil";

function App() {
  return (
    <RecoilRoot>
      <WebRoutes />
    </RecoilRoot>
  );
}

export default App;
