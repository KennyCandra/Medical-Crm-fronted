import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import AsideNormalLayout from "../components/AsideNormalLayout/AsideNormalLayout";
import { useState } from "react";

function NormalLayout() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  return (
    <div className="flex min-h-screen">
      <AsideNormalLayout
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <div className="flex w-[calc(100vw-288px)] flex-col">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}

export default NormalLayout;
