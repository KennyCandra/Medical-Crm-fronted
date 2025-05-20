import * as React from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { loginSchema, LoginSchemaType } from "../../schemas/loginSchema";
import FormInput from "../ui/FormInput";
import Button from "../ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { BASEURL } from "../../axios/instance";
import { Link, useNavigate } from "react-router-dom";
import { authHelper } from "../../helper/authHelper";

export default function LoginForm() {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginSchemaType) => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASEURL}/auth/login`, values, {
        withCredentials: true,
      });
      if (res.status === 200) {
        toast.success("Login successful");
        authHelper(res.data.accessToken, res.data.newUser);
        navigate("/dashboard");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        switch (error.response?.status) {
          case 404:
            toast.error("Wrong Credentials");
            break;
          default:
            toast.error("An unexpected error occurred");
            break;
        }
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormInput
        id="nid"
        placeholder="National ID number"
        type="text"
        label="National ID number"
        error={errors.nid?.message}
        {...register("nid")}
      />
      <div className="relative">
        <Link
          to={"/auth/forgot-password"}
          className="absolute right-0 text-sm text-purple-700 hover:text-purple-500 transition-all"
        >
          Forgot password?{" "}
        </Link>
        <FormInput
          id="password"
          placeholder="Password"
          type="password"
          label="Password"
          error={errors.password?.message}
          {...register("password")}
        />
      </div>
      <Button loading={loading}>Login</Button>
    </form>
  );
}
