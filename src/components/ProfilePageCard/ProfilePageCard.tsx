import React from "react";
import { Link } from "react-router-dom";

interface ProfilePageCardProps {
  text: string;
  number: number | string;
  color: string | null;
  textUrl?: string;
}

const ProfilePageCard: React.FC<ProfilePageCardProps> = ({
  text,
  number,
  textUrl,
}) => {
  return (
    <div className="bg-white p-6 cursor-pointer border border-gray-200 rounded-lg hover:bg-gray-100 transition-all group">
      <Link
        to={textUrl ? textUrl : undefined}
        className="text-lg font-medium capitalize group-hover:underline"
      >
        {text}
      </Link>
      <div className="mt-2 text-2xl font-semibold text-gray-700">{number}</div>
    </div>
  );
};

export default ProfilePageCard;
