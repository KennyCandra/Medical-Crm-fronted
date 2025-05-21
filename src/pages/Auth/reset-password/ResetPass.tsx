import { useNavigate, useSearchParams } from "react-router-dom";
import FormInput from "../../../components/ui/FormInput";
import Button from "../../../components/ui/Button";
import { useState } from "react";
import {
  resetPasswordSchema,
  resetPasswordSchemaType,
} from "../../../schemas/userRegSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BASEURL } from "../../../axios/instance";
import { toast } from "react-toastify";
import axios from "axios";

export default function ResetPass() {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<resetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (values: resetPasswordSchemaType) => {
    setLoading(true);
    try {
      const res = await axios.put(`${BASEURL}/auth/reset-password`, {
        token: token,
        newPassword: values.password,
      });
      if (res.status === 200) {
        navigate("/auth/login");
        toast.success("Password changed successfully");
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
    <div className="flex h-screen items-center justify-center">
      <div className="w-[500px] flex flex-col gap-8">
        <div className="p-2 rounded-md self-center bg-purple-700 flex items-center justify-center">
          <img src="/images/logo.png" className="size-8" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-semibold text-purple-700">
            Password Reset
          </h1>
          <p className="text-gray-500">
            please enter your your new password and confirm it
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormInput
            id="password"
            placeholder="Password"
            type="password"
            label="Password"
            error={errors.password?.message}
            {...register("password")}
          />

          <FormInput
            id="confirmPassword"
            placeholder="Confirm Password"
            type="password"
            label="Confirm Password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <Button loading={loading}>Change password</Button>
        </form>
      </div>
    </div>
  );
}
