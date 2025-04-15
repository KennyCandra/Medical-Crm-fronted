import { useRef, useState } from "react";
import CustomButton from "../../../components/CustomButton";
import axios from "axios";
import { userStore } from "../../../zustand/userStore";

function Login() {
  const nidRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { setUser } = userStore();

  const loginInput = [
    {
      label: "NID",
      ref: nidRef,
      type: "text",
      placeHolder: "Enter your NID",
    },
    {
      label: "Password",
      ref: passwordRef,
      type: "password",
      placeHolder: "Enter your password",
    },
  ];

  const handleLogin = async () => {
    const nid = nidRef.current?.value;
    const password = passwordRef.current?.value;
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8001/auth/login",
        {
          NID: nid,
          password,
        },
        { withCredentials: true }
      );
      console.log(res.data.user.fullname);
      setUser(res.data.user.fullname);
    } catch {
      console.log(nid, password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 >Log in</h1>

      <form
        onSubmit={(e) => e.preventDefault()}
      >
        {loginInput.map((input) => (
          <div >
            <label htmlFor={input.label} >
              {input.label}
            </label>
            <input
              autoComplete="on"
              type={input.type}
              id={input.label}
              ref={input.ref}
              placeholder={input.placeHolder}
            />
          </div>
        ))}

        <div >
          <h2>Remember me</h2>
          <input type="checkbox" />
        </div>

        <CustomButton onClick={handleLogin} loading={loading}>
          Login
        </CustomButton>
      </form>

      <p >Forgot your passowrd?</p>

      <h3 >
        Don't have an account? Sign Up
      </h3>
    </div>
  );
}

export default Login;
