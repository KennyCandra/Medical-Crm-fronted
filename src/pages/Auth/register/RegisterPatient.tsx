import { Link } from "react-router-dom";
import RegisterPatientForm from "../../../components/forms/RegisterPatientForm";

export default function RegisterPatient() {
  return (
    <div className="w-[70%] flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[#663fba]">
        Patient Registration
      </h1>
      <RegisterPatientForm />
      <div className="flex flex-col gap-2">
        <div className="text-center text-sm text-[#7a7a7a] font-['Work_Sans']">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="text-[#663fba] hover:text-[#5a36a3] font-medium"
          >
            Login
          </Link>
        </div>
        <div className="text-center ">
          <p className="text-sm font-['Work_Sans'] text-[#7a7a7a]">
            Sign up as a doctor?{" "}
            <Link
              to="/auth/register/doctor"
              className="font-medium text-[#663fba] hover:text-[#5a36a3]"
            >
              Doctor Registration
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
