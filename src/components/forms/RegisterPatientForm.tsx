import * as React from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import FormInput from "../ui/FormInput";
import Button from "../ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { BASEURL } from "../../axios/instance";
import { useNavigate } from "react-router-dom";
import {
  patientRegSchema,
  PatientRegSchemaType,
} from "../../schemas/userRegSchema";
import SelectInput from "../ui/SelectInput";
import { authHelper } from "../../helper/authHelper";

export default function RegisterPatientForm() {
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<PatientRegSchemaType>({
    resolver: zodResolver(patientRegSchema),
  });

  console.log(errors);

  const onSubmit = async (values: PatientRegSchemaType) => {
    setLoading(true);
    console.log(values);
    try {
      const res = await axios.post(`${BASEURL}/auth/sign-up`, {
        firstName: values.firstName,
        lastName: values.lastName,
        NID: values.nid,
        password: values.password,
        role: "patient",
        birth_date: values.birth_date,
        gender: genders.find((g) => g.id === watch("gender"))?.value,
        blood_type: bloodTypeOptions.find((g) => g.id === watch("blood_type"))
          ?.name,
        email: values.email,
      });
      if (res.status === 201) {
        toast.success("Login successful");
        console.log(res.data);

        authHelper(res.data.accessToken, res.data.newUser);
        console.log("here");
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
    setValue("gender", "");
    setValue("blood_type", "");
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
        id="nid"
        placeholder="National ID number"
        type="text"
        label="National ID number"
        error={errors.nid?.message}
        {...register("nid")}
      />

      <FormInput
        id="email"
        placeholder="Email"
        type="email"
        label="Email"
        error={errors.email?.message}
        {...register("email")}
      />

      <FormInput
        id="birth_date"
        placeholder="Date of Birth"
        type="date"
        label="Date of Birth"
        error={errors.birth_date?.message}
        {...register("birth_date")}
      />

      <div className="flex gap-4">
        <SelectInput
          values={bloodTypeOptions || []}
          selected={watch("blood_type")}
          setSelected={(value) => setValue("blood_type", value)}
          header="Blood type"
          error={errors.blood_type?.message}
        />
        <SelectInput
          values={genders || []}
          selected={watch("gender")}
          setSelected={(value) => setValue("gender", value)}
          header="Gender"
          error={errors.gender?.message}
        />
      </div>

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

      <Button loading={loading}>Register</Button>
    </form>
  );
}
