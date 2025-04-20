import { useQuery } from "@tanstack/react-query";
import { userStore } from "../../zustand/userStore";
import axios from "axios";
import ProfilePageCard from "../../components/ProfilePageCard/ProfilePageCard";
import DoctorActionsCard from "../../components/DoctorActions/DoctorActionsCard";
type card = {
  id: number;
  text: string;
  number: number | string;
  color: string | null;
};

const cardsInputs: card[] = [
  {
    id: 1,
    text: "prescriptions",
    number: 100,
    color: " bg-linear-to-r from-primary via-primary to-white text-white",
  },
  {
    id: 2,
    text: "diagnosis",
    number: 100,
    color: null,
  },
  {
    id: 3,
    text: "sepcialazation",
    number: "some description idk",
    color: null,
  },
];

const DoctorActions = [
  {
    id: 1,
    action: "create a prescription",
    img: "/images/prescription.svg",
    link: "/prescription/create",
  },
  {
    id: 2,
    action: "make a diagnosis",
    img: "/images/report-medical.svg",
    link: "/",
  },
];

function Profile() {
  const { user, accessToken } = userStore();
  const { data } = useQuery({
    queryKey: ["profile", user],
    queryFn: () =>
      axios
        .get(`http://localhost:8001/auth/profile`, {
          headers: {
            Authorization: accessToken,
            "Content-Type": "application/json",
          },
        })
        .then((res) => res.data),
  });
  console.log(data);
  return (
    <div className="mt-20 ml-5">
      <div className="font-primary flex gap-5">
        {cardsInputs.map((input) => (
          <ProfilePageCard
            text={input.text}
            number={input.number}
            color={input.color ? input.color : ""}
          />
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-2 p-2 border border-gray-400 w-[25%]">
        <h1 className="font-bold text-3xl">Doctor Actions</h1>
        {DoctorActions.map((action) => (
          <DoctorActionsCard
            link={action.link}
            img={action.img ? action.img : ""}
            action={action.action}
            key={action.id}
          />
        ))}
      </div>
    </div>
  );
}

export default Profile;
