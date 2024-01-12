import React from "react";
import ReactDOM from "react-dom/client"; // 新しいインポート方法
import MyComponent from "./MyComponent";

// 新しいcreateRootを使ってアプリケーションをレンダリング
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <MyComponent />
  </React.StrictMode>
);
