import type { medication } from "../../pages/createPrescription/CreatePrescription";

type Props = {
  name: medication;
  setSelect: React.Dispatch<React.SetStateAction<medication[]>>;
};

function DrugInfo({ name, setSelect }: Props) {
  const handleDoseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelect((prev) => {
      return prev.map((drug) => {
        if (drug.drug.id === name.drug.id) {
          return { ...drug, dose: e.target.value };
        }
        return drug;
      });
    });
  };

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelect((prev) => {
      return prev.map((drug) => {
        if (drug.drug.id === name.drug.id) {
          return { ...drug, frequency: e.target.value };
        }
        return drug;
      });
    });
  };

  return (
    <tr className="border-solid border-black border-2">
      <td className="border-solid border-black border-2">{name.drug.name}</td>
      <td className="border-solid border-black border-2">
        <input
          type="text"
          value={name.dose}
          onChange={handleDoseChange}
          placeholder="Enter dose"
          className="border border-gray-300 rounded p-1"
        />
      </td>
      <td className="border-solid border-black border-2">
        <input
          type="text"
          value={name.frequency}
          onChange={handleFrequencyChange}
          placeholder="Enter frequency"
          className="border border-gray-300 rounded p-1"
        />
      </td>
    </tr>
  );
}

export default DrugInfo;
