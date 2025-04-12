type CustomButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
};

function CustomButton({ children, onClick, className }: CustomButtonProps) {
  return (
    <button
      onClick={onClick}
      className={className ? className : "text-white bg-primary-100 py-2 px-4 text-2xl font-bold rounded-lg"}
    >
      {children}
    </button>
  );
}

export default CustomButton;
