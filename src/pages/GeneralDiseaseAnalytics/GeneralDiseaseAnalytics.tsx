import { useState } from "react";
import { 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import useFetchDiseaseAnalytics from "../../Services/useFetchDiseaseAnalytics";
import { userStore } from "../../zustand/userStore";
import DiseaseId from "../../components/formValues/DiseaseId";
import { Formik, Form } from "formik";
import * as Yup from "yup";

export type Disease = {
  id: string;
  name: string;
};

function GeneralDiseaseAnalytics() {
  const { role } = userStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [diseaseId, setDiseaseId] = useState("04d4a436-bdf9-43b8-8011-670266275e6a");

  const analytics = useFetchDiseaseAnalytics(diseaseId, role);

  const handleSubmit = (values) => {
    if (values.diseaseId) {
      setDiseaseId(values.diseaseId);
    }
  };

  const validationSchema = Yup.object({
    diseaseId: Yup.string().required("Please select a disease")
  });

  if (analytics.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-lg text-gray-700">Loading analytics data...</span>
      </div>
    );
  }

  if (analytics.isError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-medium">Error loading disease analytics</p>
        <p className="text-sm">Please try again or contact support if the issue persists.</p>
      </div>
    );
  }

  const data = analytics.data?.map((item) => ({
    count: item.count,
    cumulativeCount: item.cumulativeCount,
    diseaseName: item.diseaseName,
    month: item.month,
    monthName: item.monthName,
  })) || [];

  const diseaseName = data.length > 0 ? data[0].diseaseName : "Selected Disease";

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Disease Diagnoses Analytics (2025)
      </h1>

      <div className="mb-8">
        <Formik
          initialValues={{ diseaseId: diseaseId }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <DiseaseId
                    selectedDisease={selectedDisease}
                    setSelectedDisease={setSelectedDisease}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    setFieldValue={setFieldValue}
                    errors={errors.diseaseId}
                    touched={touched.diseaseId}
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-150"
                  >
                    Update Analytics
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {data.length > 0 ? (
        <>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Monthly & Cumulative View for {diseaseName}
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="monthName" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', borderColor: '#e2e8f0' }}
                    formatter={(value, name) => [value, name === 'count' ? 'Monthly Cases' : 'Cumulative Cases']}
                  />
                  <Legend />
                  <Bar 
                    yAxisId="left" 
                    dataKey="count" 
                    name="Monthly Cases" 
                    fill="#4f46e5" 
                    barSize={30}
                    radius={[4, 4, 0, 0]}
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="cumulativeCount" 
                    name="Cumulative Cases"
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Data Table for {diseaseName}
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Month
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monthly Diagnoses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cumulative Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((month, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {month.monthName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {month.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {month.cumulativeCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg">
          No data available for the selected disease. Please try another selection.
        </div>
      )}
    </div>
  );
}

export default GeneralDiseaseAnalytics;