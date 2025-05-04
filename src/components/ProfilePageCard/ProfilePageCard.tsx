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
  color,
  textUrl,
}) => {
  const cardClass = color || "bg-white shadow-md text-gray-900";

  return (
    <div className={`rounded-lg p-6 ${cardClass} border-gray-500`}>
      <Link
        to={textUrl ? textUrl : undefined}
        className="text-lg font-medium capitalize hover:underline"
      >
        {text}
      </Link>
      <div className="mt-2 text-1xl font-bold">{number}</div>
    </div>
  );
};

export default ProfilePageCard;
