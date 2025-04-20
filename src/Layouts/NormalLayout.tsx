import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import AsideNormalLayout from "../components/AsideNormalLayout/AsideNormalLayout";

function NormalLayout() {
  return (
    <div className="flex">
      <AsideNormalLayout />
      <div className="flex flex-col w-full">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}

export default NormalLayout;
