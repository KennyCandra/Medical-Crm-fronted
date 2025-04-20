import { Link } from "react-router-dom";

type props = {
  img: string;
  action: string;
  link: string;
};

function DoctorActionsCard({ img, action, link }: props) {
  return (
    <div className="flex rounded-2xl p- min-h-[100px] w-full items-center ">
      <div className="w-full flex items-center gap-2 ml-2 bg-[#ebebeb]">
        <img src={img} className="bg-primary p-2 rounded-2xl size-15" />
        <h2 className="font-bold">
          <Link to={link}>{action}</Link>
        </h2>
      </div>
    </div>
  );
}

export default DoctorActionsCard;
