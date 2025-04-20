type CustomButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  loading?: boolean;
};

function CustomButton({
  children,
  onClick,
  loading,
}: CustomButtonProps) {
  return (
    <button
    className="bg-primary w-fit text-white font-bold py-2 px-4 rounded-full cursor-pointer hover:scale-90 active:scale-105"
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <div>
          <img src="/images/loader.svg"  />
        </div>
      ) : (
        children
      )}
    </button>
  );
}

export default CustomButton;
