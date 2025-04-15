import { useNavigate } from "react-router-dom";
import CustomButton from "../../../components/CustomButton";

function SignUp() {
  const navigate = useNavigate();
  return (
    <div >
      <div >
        <h1 >SignUp</h1>
        <CustomButton onClick={() => console.log("patient")}>
          Patient
        </CustomButton>
        <CustomButton onClick={() => console.log("doctor")}>
          Doctor
        </CustomButton>
      </div>
      <h3 onClick={() => navigate("/login")}>Already have an account?</h3>
    </div>
  );
}

export default SignUp;
