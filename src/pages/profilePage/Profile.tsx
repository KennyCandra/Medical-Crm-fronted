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
  return (
    <div className="mt-20 ml-5">
      <div className="font-primary flex gap-5">
        {cardsInputs.map((input) => (
          <ProfilePageCard
            key={input.id}
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
