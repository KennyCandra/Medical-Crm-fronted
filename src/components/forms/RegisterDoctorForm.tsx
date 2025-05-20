import * as React from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import FormInput from "../ui/FormInput";
import Button from "../ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { BASEURL } from "../../axios/instance";
import { Form, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  doctorRegSchema,
  DoctorRegSchemaType,
} from "../../schemas/userRegSchema";
import SelectInput from "../ui/SelectInput";
import { authHelper } from "../../helper/authHelper";

export default function RegisterDoctorForm() {
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  const { data: specialities } = useQuery({
    queryKey: ["specialities"],
    queryFn: () => axios.get(`${BASEURL}/spec`).then((res) => res.data),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<DoctorRegSchemaType>({
    resolver: zodResolver(doctorRegSchema),
  });

  const onSubmit = async (values: DoctorRegSchemaType) => {
    setLoading(true);
    console.log(values);
    try {
      const res = await axios.post(`${BASEURL}/auth/sign-up`, {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        NID: values.nid,
        password: values.password,
        role: "doctor",
        birth_date: values.birth_date,
        gender: genders.find((g) => g.id === watch("gender"))?.value,
        speciality: watch("speciality"),
        license: values.license,
        blood_type: bloodTypeOptions.find((g) => g.id === watch("blood_type"))
          ?.name,
      });
      if (res.status === 201) {
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

  const genders = [
    {
      id: "1",
      name: "Male",
      value: "male",
    },
    {
      id: "2",
      name: "Female",
      value: "female",
    },
  ];

  React.useEffect(() => {
    setValue("speciality", "");
    setValue("gender", "");
  }, []);

  const bloodTypeOptions = [
    { id: "1", name: "A+" },
    { id: "2", name: "A-" },
    { id: "3", name: "B+" },
    { id: "4", name: "B-" },
    { id: "5", name: "O+" },
    { id: "6", name: "O-" },
    { id: "7", name: "AB+" },
    { id: "8", name: "AB-" },
    { id: "9", name: "unknown" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="flex flex-col w-[55%] gap-4">
          <div className="flex gap-4">
            <FormInput
              id="firstName"
              placeholder="First Name"
              type="text"
              label="First Name"
              error={errors.firstName?.message}
              {...register("firstName")}
            />
            <FormInput
              id="lastName"
              placeholder="Last Name"
              type="text"
              label="Last Name"
              error={errors.lastName?.message}
              {...register("lastName")}
            />
          </div>

          <FormInput
            id="email"
            placeholder="Email"
            type="email"
            label="Email"
            error={errors.email?.message}
            {...register("email")}
          />

          <FormInput
            id="nid"
            placeholder="National ID number"
            type="text"
            label="National ID number"
            error={errors.nid?.message}
            {...register("nid")}
          />

          <FormInput
            id="birth_date"
            placeholder="Date of Birth"
            type="date"
            label="Date of Birth"
            error={errors.birth_date?.message}
            {...register("birth_date")}
          />

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
        </div>

        <div className="flex flex-col w-[45%] gap-4">
          <SelectInput
            values={genders || []}
            selected={watch("gender")}
            setSelected={(value) => setValue("gender", value)}
            header="gender"
            error={errors.gender?.message}
          />

          <SelectInput
            values={specialities?.specializations || []}
            selected={watch("speciality")}
            setSelected={(value) => setValue("speciality", value)}
            header="speciality"
            error={errors.speciality?.message}
          />

          <FormInput
            id="license"
            placeholder="Medical License Number"
            type="text"
            label="Medical License Number"
            error={errors.license?.message}
            {...register("license")}
          />

          <SelectInput
            values={bloodTypeOptions || []}
            selected={watch("blood_type")}
            setSelected={(value) => setValue("blood_type", value)}
            header="blood type"
            error={errors.blood_type?.message}
          />
        </div>
      </div>

      <Button loading={loading}>Register</Button>
    </form>
  );
}
