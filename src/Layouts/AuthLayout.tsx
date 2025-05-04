import { Outlet } from "react-router-dom";
import { Heart } from "lucide-react";

function AuthLayout() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#f6e7fe] to-white p-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row">
        <div className="bg-[#f6e7fe] p-8 md:p-12 flex flex-col justify-center items-center md:w-1/2 order-2 md:order-1">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <img
                src="/images/logo.png"
                alt="Sanova Logo"
                className="h-24 w-auto object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold text-[#663fba] mb-2 font-['Poppins']">
              Sanova
            </h1>
            <p className="text-xl text-[#7a7a7a] font-['Work_Sans']">
              Your first medical assistant
            </p>
            <div className="mt-8 hidden md:block">
              <div className="bg-white bg-opacity-80 p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Heart className="text-[#fe91ad] h-5 w-5 fill-[#fe91ad]" />
                  <span className="font-['Poppins'] font-medium text-[#663fba]">
                    Healthcare Reimagined
                  </span>
                </div>
                <p className="text-[#7a7a7a] italic font-['Work_Sans']">
                  "Providing accessible healthcare solutions that empower both
                  patients and doctors."
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 flex items-center justify-center md:w-1/2 order-1 md:order-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
