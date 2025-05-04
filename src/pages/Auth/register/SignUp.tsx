import { Link } from "react-router-dom";
import { UserPlus, Stethoscope, LogIn } from "lucide-react";

function SignUp() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 rounded-lg max-w-md mx-auto">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-['Poppins'] font-bold text-3xl text-[#663fba] mb-2">
            Create Account
          </h1>
          <p className="font-['Work_Sans'] text-[#7a7a7a]">
            Choose how you want to sign up
          </p>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <Link
            to="/register/patient"
            className="flex items-center justify-center gap-3 bg-[#663fba] text-white py-3 px-6 rounded-lg transition-all duration-300 hover:bg-[#5a36a3] hover:shadow-lg group"
          >
            <UserPlus className="h-5 w-5 transition-transform group-hover:scale-110" />
            <span className="font-['Poppins'] font-medium">
              Sign up as Patient
            </span>
          </Link>

          <Link
            to="/register/doctor"
            className="flex items-center justify-center gap-3 bg-white text-[#663fba] border-2 border-[#663fba] py-3 px-6 rounded-lg transition-all duration-300 hover:bg-[#f6e7fe] hover:shadow-lg group"
          >
            <Stethoscope className="h-5 w-5 transition-transform group-hover:scale-110" />
            <span className="font-['Poppins'] font-medium">
              Sign up as Doctor
            </span>
          </Link>
        </div>

        <div className="text-center">
          <p className="font-['Work_Sans'] text-[#7a7a7a]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#663fba] hover:text-[#5a36a3] flex items-center justify-center gap-1 mt-2 mx-auto w-fit"
            >
              <LogIn className="h-4 w-4" />
              <span>Log in</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
