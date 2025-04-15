import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import CustomButton from "../../components/CustomButton";

type drug = {
  id: string;
  name: string;
  route: string;
};
type drugAPI = {
  message: string;
  drugs: drug[];
};

const prescriptionInputValues = [
  {
    label: "Patient id",
    type: "text",
    placeholder: "Enter patient name",
  },
  {
    label: "doctor id",
    type: "text",
    placeholder: "Enter doctor name",
  },
  {
    label: "Prescription",
    type: "text",
    placeholder: "Enter prescription name",
  },
  {
    label: "Date",
    type: "date",
    placeholder: "Enter date",
  },
];

function CreatePrescriptionPage() {
  const [select, setSelect] = useState<drug[]>([]);
  const { data } = useQuery<drugAPI>({
    queryKey: ["drugs"],
    queryFn: () =>
      axios.get("http://localhost:8001/drug/").then((res) => res.data),
  });
  const handleClick = async () => {
    const meds = select.map((med) => {
      return {
        id: med.id,
        name: med.name,
        route: med.route,
        dosage: "100mg",
        frequency: "twice a day",
      };
    });
    console.log(select);
    const res = await axios.post("http://localhost:8001/presc/create", {
      doctorId: "04ebb97d-adfe-43fc-95b0-d0800909312e",
      patientId: "4e85d90f-1b35-4f5a-b882-47c29d3e8877",
      medications: meds,
    });
    console.log(res);
  };
  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          {prescriptionInputValues.map((input) => (
            <div key={input.label}>
              <label htmlFor={input.label}>{input.label}</label>
              <input type={input.type} placeholder={input.placeholder} />
            </div>
          ))}
          <div>
            {data?.drugs.map((drug) => (
              <div onClick={() => setSelect([...select, drug])} key={drug.id}>
                {drug.name}
              </div>
            ))}
          </div>
        </div>
        <div>
          {select.length > 0 ? (
            select.map((drug) => <p>{drug.name}</p>)
          ) : (
            <div>no drugs yet</div>
          )}
        </div>
        <CustomButton onClick={handleClick}>Submit</CustomButton>
      </form>
    </div>
  );
}

export default CreatePrescriptionPage;
