import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex justify-center items-center min-w-screen min-h-screen bg-gray-100 ">
      <div className="justify-around bg-white shadow-md rounded-lg p-8 w-full flex min-w-[50%] max-w-[900px] gap-5">
        <Outlet />;
        <div className="self-center flex flex-col items-center">
          <img src="/images/logo.png" />
          <h1 className="text-4xl font-bold">Sanova</h1>
          <p className="text-xl text-gray-700">your first medical assistant</p>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
