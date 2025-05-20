import { Link } from "react-router-dom";
import LoginForm from "../../../components/forms/LoginForm";

function Login() {
  return (
    <div className="w-[500px] flex flex-col gap-8">
      <div className="flex flex-col items-center gap-1">
        <h1 className="text-3xl font-bold text-purple-700">Welcome Back</h1>
        <p className="text-gray-500">Sign in to your Sanova account</p>
      </div>
      <LoginForm />
      <div className="text-sm flex items-center justify-center gap-1">
        <p className="text-gray-500">Don't have an account? </p>
        <Link
          to="/auth/register"
          className="font-medium text-[#663fba] hover:text-[#5a36a3]"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default Login;
