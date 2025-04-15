import axios from "axios";
import { useRef, useState } from "react";
import CustomButton from "../../../components/CustomButton";
import { useQuery } from "@tanstack/react-query";

type bloodType =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "O+"
  | "O-"
  | "AB+"
  | "AB-"
  | "unknown";

type genderType = "male" | "female";
type speciality = {
  id: string;
  description: null;
  name: string;
};

type fetchedData = {
  message: string;
  specializations: speciality[];
};

function Register() {
  const fNameRef = useRef<HTMLInputElement>(null);
  const lNameRef = useRef<HTMLInputElement>(null);
  const nidRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const licenseRef = useRef<HTMLInputElement>(null);
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [bloodType, setBloodType] = useState<bloodType>("unknown");
  const [gender, setGender] = useState<genderType>("male");
  const specialtyRef = useRef<HTMLSelectElement>(null);

  const { data } = useQuery<fetchedData>({
    queryKey: ["specialities"],
    queryFn: () =>
      axios.get("http://localhost:8001/spec").then((res) => res.data),
  });

  const SignUpVariabls = [
    {
      label: "First Name",
      ref: fNameRef,
      type: "text",
      placeHolder: "Enter your first name",
    },
    {
      label: "Last Name",
      ref: lNameRef,
      type: "text",
      placeHolder: "Enter your last name",
    },
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
    {
      label: "Confirm Password",
      ref: confirmPasswordRef,
      type: "password",
      placeHolder: "Enter your confirm password",
    },
  ];

  const handleSignUp = async () => {
    const response = await axios.post("http://localhost:8001/auth/sign-up", {
      fName: fNameRef.current?.value,
      lName: lNameRef.current?.value,
      gender: gender,
      NID: nidRef.current?.value,
      password: passwordRef.current?.value,
      role: role,
      license: licenseRef.current?.value,
      blood: bloodType,
      specialization: specialtyRef.current?.value,
    });

    console.log(response);
  };

  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        {SignUpVariabls.map((input) => (
          <div key={input.label}>
            <label>
              {input.label}
              <input
                type={input.type}
                placeholder={input.placeHolder}
                ref={input.ref}
                required
              />
            </label>
          </div>
        ))}
        <label>
          Gender:
          <select
            onChange={(e) => setGender(e.target.value as genderType)}
            value={gender}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <label>
          Role:
          <select
            onChange={(e) => setRole(e.target.value as "patient" | "doctor")}
            value={role}
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </label>

        {role === "patient" && (
          <label>
            Blood Type:
            <select
              onChange={(e) => setBloodType(e.target.value as bloodType)}
              value={bloodType}
            >
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="unknown">Unknown</option>
            </select>
          </label>
        )}
        {role === "doctor" && (
          <div>
            <label>
              License:
              <input
                type="number"
                placeholder="Your medical license"
                ref={licenseRef}
                required
              />
            </label>

            <label>
              Blood Type:
              <select ref={specialtyRef}>
                {data?.specializations.map((spec) => (
                  <option value={spec.name}>{spec.name}</option>
                ))}
              </select>
            </label>
          </div>
        )}
        <CustomButton onClick={handleSignUp}>Submit</CustomButton>
      </form>
    </div>
  );
}

export default Register;
