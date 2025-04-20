import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import CustomButton from "../../components/CustomButton/CustomButton";
import DrugInfo from "../../components/DrugInfo/DrugInfo";
import { userStore } from "../../zustand/userStore";
import CustomDropDownMenu from "../../components/CustomDropDownMenu/CustomDropDownMenu";
import { useNavigate } from "react-router-dom";

type props = {
  patientId?: string;
};

type drug = {
  id: string;
  name: string;
  route: string;
};
type drugAPI = {
  message: string;
  drugs: drug[];
};

export type mdeication = {
  drug: drug;
  frequency: string;
  dose: string;
};

type User = {
  fullname: string;
  id: string;
  nid: string;
};

type userAPI = {
  users: User[];
};

function CreatePrescription({ patientId: initialPatientId }: props) {
  const navigate = useNavigate()
  const { medLiscence } = userStore();
  const [select, setSelect] = useState<mdeication[]>([]);
  const [patientId, setPatientId] = useState<string>(initialPatientId || "");
  const [searchValue, setSearchValue] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openDrugsModal, setDrugsModal] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>("");

  const patientData = useQuery<userAPI>({
    queryKey: ["patientData", searchValue],
    queryFn: () =>
      axios.get(`http://localhost:8001/auth/${searchValue}`).then((res) => {
        return res.data;
      }),
  });

  const { data } = useQuery<drugAPI>({
    queryKey: ["drugs", searchString],
    queryFn: () =>
      axios
        .post("http://localhost:8001/drug/", {
          value: searchString,
        })
        .then((res) => res.data),
  });

  const handleClick = async () => {
    try {
      const res = await axios.post("http://localhost:8001/presc/create", {
        doctorId: "04ebb97d-adfe-43fc-95b0-d0800909312e",
        patientId: "3428ebc0-d8ab-470c-94de-38a2d3769bb8",
        medications: select,
      });

      if (res.status === 201) {
        navigate('/profile')
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddToSelect = (drug: drug) => {
    if (!select.some((med) => med.drug.id === drug.id)) {
      setSelect([
        ...select,
        {
          drug: drug,
          dose: "",
          frequency: "",
        },
      ]);
    }
  };

  const formFields = [
    {
      label: "patient NID",
      name: "patientNid",
      value: patientId || "please choose patient nid",
      disabled: true,
    },
    {
      label: "doctor NID",
      name: "doctorId",
      value: medLiscence || "",
      disabled: true,
    },
  ];

  return (
    <div className="flex flex-col mx-4">
      <h1 className="text-4xl font-secondary font-bold">
        creating prescription
      </h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="flex justify-between">
          <div>
            {formFields.map((field) => (
              <div key={field.name} className="space-x-4">
                <label htmlFor={field.name}>{field.label}</label>
                <input
                  type="text"
                  name={field.name}
                  value={field.value}
                  disabled={field.disabled}
                />
              </div>
            ))}
          </div>

          <CustomDropDownMenu
            openModal={openModal}
            searchValue={searchValue}
            searchingTopic={"patient nid"}
            setOpenModal={setOpenModal}
            setSearchValue={setSearchValue}
          >
            {patientData.data?.users.map((user) => (
              <div
                className="text-black w-full cursor-pointer py-4"
                onClick={() => {
                  setPatientId(user.nid);
                  setOpenModal(false);
                }}
              >
                <p>{user.nid}</p>
                <p>{user.fullname}</p>
              </div>
            ))}
          </CustomDropDownMenu>
        </div>

        <div className="flex justify-between">
          <CustomDropDownMenu
            openModal={openDrugsModal}
            searchValue={searchString}
            searchingTopic={"your drug"}
            setOpenModal={setDrugsModal}
            setSearchValue={setSearchString}
          >
            {data?.drugs.map((drug) => (
              <div
                className="cursor-pointer"
                onClick={() => {
                  handleAddToSelect(drug);
                  setDrugsModal(false);
                }}
                key={drug.id}
              >
                {drug.name}
              </div>
            ))}
          </CustomDropDownMenu>
          <CustomButton onClick={handleClick}>Create Prescription</CustomButton>
        </div>

        {select.length > 0 ? (
          <table className="border-solid border-black border-2">
            <tr className="border-solid border-black border-2">
              <th className="border-solid border-black border-2">name</th>
              <th className="border-solid border-black border-2">frequency</th>
              <th className="border-solid border-black border-2">dosage</th>
            </tr>
            {select.map((drug) => (
              <DrugInfo name={drug} setSelect={setSelect} />
            ))}
          </table>
        ) : (
          <div>no drugs yet</div>
        )}
      </form>
    </div>
  );
}

export default CreatePrescription;
