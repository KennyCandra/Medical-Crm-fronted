import React from "react";
import { Link } from "react-router-dom";

interface DoctorActionsCardProps {
  action: string;
  img: string;
  link: string;
}

const Actions: React.FC<DoctorActionsCardProps> = ({ action, img, link }) => {
  return (
    <Link
      to={link}
      className="bg-white p-6 cursor-pointer border border-gray-200 rounded-lg hover:bg-gray-100 transition-all group flex items-center gap-4"
    >
      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:underline">
        <img src={img} alt={action} width={24} height={24} />
      </div>
      <h3 className="text-lg font-medium text-gray-800 group-hover:underline">
        {action}
      </h3>
    </Link>
  );
};

export default Actions;
