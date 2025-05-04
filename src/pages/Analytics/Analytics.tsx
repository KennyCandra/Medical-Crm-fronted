import { Link } from "react-router-dom";
import CustomButton from "../../components/CustomButton/CustomButton";

function Analytics() {
  return (
    <div className="w-full h-96 p-4  gap-4 items-center flex flex-col justify-center">
      <h2 className="text-xl font-bold text-center mb-4">Analytics</h2>
      <div className="space-x-4">
        <CustomButton onClick={() => {}}>
          <Link to="/analytics/general-disease-analytics">Disease Analytics</Link>
        </CustomButton>
        <CustomButton onClick={() => {}}>
          <Link to="/analytics/general-drug-analytics">General Drug Analytics</Link>
        </CustomButton>
      </div>
    </div>
  );
}

export default Analytics;
