import { Link } from "react-router-dom";
import FormInput from "../../../components/ui/FormInput";
import Button from "../../../components/ui/Button";
import { useState } from "react";
import {
  resetPasswordUsingEmailSchema,
  resetPasswordUsingEmailSchemaType,
} from "../../../schemas/userRegSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BASEURL } from "../../../axios/instance";
import { toast } from "react-toastify";
import axios from "axios";

export default function ForgotPass() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<resetPasswordUsingEmailSchemaType>({
    resolver: zodResolver(resetPasswordUsingEmailSchema),
  });

  const message =
    "The reset link has been sent to your email, please check your inbox and spam folder";

  const onSubmit = async (values: resetPasswordUsingEmailSchemaType) => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASEURL}/auth/forget-password`, values);
      if (res.status === 200) {
        setSuccess(true);
        toast.success("Link sent successfully");
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

        {success ? (
          <div className="bg-green-100 text-green-700 p-4 rounded-md text-center">
            <p>{message}</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-3xl font-semibold text-purple-700">
                Password Reset
              </h1>
              <p className="text-gray-500">
                please enter your email address to sent you the reset link
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormInput
                id="email"
                placeholder="Email"
                type="email"
                label="Email"
                error={errors.email?.message}
                {...register("email")}
              />
              <Button loading={loading}>Reset password</Button>
            </form>
          </>
        )}

        <div className="text-sm flex justify-center">
          <Link
            to="/auth/login"
            className="font-medium text-purple-700 hover:text-purple-500 transition-all"
          >
            Back to login{" "}
          </Link>
        </div>
      </div>
    </div>
  );
}
