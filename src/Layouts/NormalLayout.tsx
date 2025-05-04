import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import AsideNormalLayout from "../components/AsideNormalLayout/AsideNormalLayout";
import { useState } from "react";

function NormalLayout() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  return (
    <div className="flex flex-1 overflow-y-hidden overflow-x-hidden h-full">
      <AsideNormalLayout isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`flex flex-col w-full ${isCollapsed ? "ml-16" : "ml-64"}`}>
        <Header />
        <Outlet />
      </div>
    </div>
  );
}

export default NormalLayout;
