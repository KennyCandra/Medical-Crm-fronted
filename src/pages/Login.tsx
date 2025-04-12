import { useRef } from "react";
import CustomButton from "../components/CustomButton";

function Login() {
  const nidRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleLogin = () => {
    const nid = nidRef.current?.value;
    const password = passwordRef.current?.value;

    console.log(nid, password);
  };

  return (
    <div className="flex flex-col gap-4 w-3/4">
      <h1 className="text-secondary-100 text-2xl font-bold ">Log in</h1>

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col w-fit">
          <label htmlFor="nid">NID</label>
          <input type="text" className="border-black border-2 rounded-lg px-5 py-2" id="nid" ref={nidRef} placeholder="Enter your NID"/>
        </div>

        <div className="flex flex-col w-fit">
          <label htmlFor="password">Password</label>
          <input type="password" className="border-black border-2 rounded-lg px-5 py-2" id="password" ref={passwordRef} placeholder="Enter your password" />
        </div>

        <div>
          <h2>Remember me</h2>
          <input type="checkbox" />
        </div>

        <CustomButton onClick={handleLogin}>Login</CustomButton>
      </form>

      <p className="underline">Forgot your passowrd?</p>

      <h3 className="underline">Don't have an account? Sign Up</h3>
    </div>
  );
}

export default Login;
