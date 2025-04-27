import { Link } from "react-router-dom";

function SignUp() {
  return (
    <div className="flex flex-col gap-5 items-center">
      <h1 className="font-poppins font-bold text-2xl">Sign Up</h1>
      <div className="space-x-3">
        <Link
          className="bg-primary w-fit text-white py-2 px-6 rounded-xl cursor-pointer hover:scale-90 active:scale-105"
          to="/register/patient"
        >
          Patient
        </Link>
        <Link
          className="bg-primary w-fit text-white py-2 px-6 rounded-xl cursor-pointer hover:scale-90 active:scale-105"
          to="/register/doctor"
        >
          Doctor
        </Link>
      </div>
      <p className="text-sm text-gray-600 mt-2">
        already have account??{" "}
        <Link
          to="/login"
          className="font-medium text-primary hover:text-primary-dark"
        >
          login
        </Link>
      </p>
    </div>
  );
}

export default SignUp;
