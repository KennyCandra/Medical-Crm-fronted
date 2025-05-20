import { Link } from "react-router-dom";
import { UserPlus, Stethoscope } from "lucide-react";

function SignUp() {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-1">
        <h1 className="text-3xl font-bold text-purple-700">Create Account</h1>
        <p className="text-gray-500"> Choose how you want to sign up</p>
      </div>
      <div className="flex flex-col gap-4 w-96">
        <Link
          to="/auth/register/patient"
          className="flex items-center justify-center gap-3 bg-purple-700 text-white py-3 px-6 rounded-lg transition-all duration-300 hover:bg-[#5a36a3] hover:shadow-lg group"
        >
          <UserPlus className="h-5 w-5 transition-transform group-hover:scale-110" />
          <span className="font-medium">Sign up as Patient</span>
        </Link>
        <Link
          to="/auth/register/doctor"
          className="flex items-center justify-center gap-3 text-purple-700 border-2 border-purple-700 py-3 px-6 rounded-lg transition-all duration-300 hover:bg-purple-700/10 hover:shadow-lg group"
        >
          <Stethoscope className="h-5 w-5 transition-transform group-hover:scale-110" />
          <span className="font-medium">Sign up as Doctor</span>
        </Link>
      </div>
      <div className="text-sm flex items-center justify-center gap-1">
        <p className="text-gray-500">Already have an account? </p>
        <Link
          to="/auth/login"
          className="font-medium text-[#663fba] hover:text-[#5a36a3]"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}

export default SignUp;
