import React from "react";
import { Link } from "react-router-dom";

interface DoctorActionsCardProps {
  action: string;
  img: string;
  link: string;
}

const Actions: React.FC<DoctorActionsCardProps> = ({ action, img, link }) => {
  return (
    <Link to={link}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        <div className="flex items-center">
          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <img src={img} alt={action} width={24} height={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-800">{action}</h3>
        </div>
      </div>
    </Link>
  );
};

export default Actions;
