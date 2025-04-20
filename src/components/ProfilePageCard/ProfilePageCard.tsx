type props = {
  text: string;
  number: number | string;
  color: string;
};

function ProfilePageCard({ text, number, color }: props) {
  return (
    <div
      className={`border border-gray-400 rounded-2xl p-2 min-h-[100px] w-[25%] font-poppins text-md flex flex-col justify-between ${
        color ? color : ` bg-white`
      }`}
    >
    <p>{text}</p>
    <p>{number}</p>
    </div>
  );
}

export default ProfilePageCard;
