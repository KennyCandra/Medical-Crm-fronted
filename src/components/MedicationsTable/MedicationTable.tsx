const MedicationsTable = ({ select, setSelect, setFieldValue }) => {
  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      {select.length > 0 && (
        <div className="mb-4">
          <h3 className="text-md font-medium mb-2">Selected Medications</h3>
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Medication
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Route
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Dose
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Frequency
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    time
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {select.map((med, index) => (
                  <tr key={med.drug.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      {med.drug.name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      {med.drug.route}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <input
                        type="text"
                        className="border px-2 py-1 rounded w-20"
                        value={med.dose}
                        onChange={(e) => {
                          const newSelect = [...select];
                          newSelect[index].dose = e.target.value;
                          setSelect(newSelect);
                          setFieldValue("medication", newSelect);
                        }}
                        placeholder="Dose"
                      />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <input
                        type="text"
                        className="border px-2 py-1 rounded w-24"
                        value={med.frequency}
                        onChange={(e) => {
                          const newSelect = [...select];
                          newSelect[index].frequency = e.target.value;
                          setSelect(newSelect);
                          setFieldValue("medication", newSelect);
                        }}
                        placeholder="Frequency"
                      />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <select
                        className="border px-2 py-1 rounded w-24"
                        value={med.time || ""}
                        onChange={(e) => {
                          const newSelect = [...select];
                          newSelect[index].time = e.target.value;
                          setSelect(newSelect);
                          setFieldValue("medication", newSelect);
                        }}
                      >
                        <option value="">Select</option>
                        <option value="before">Before</option>
                        <option value="after">After</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => {
                          const newSelect = [...select];
                          newSelect.splice(index, 1);
                          setSelect(newSelect);
                          setFieldValue("medication", newSelect);
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationsTable;
