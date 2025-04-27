type CustomButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
};

function CustomButton({
  children,
  className,
  onClick,
  disabled,
}: CustomButtonProps) {
  return (
    <button
      type="submit"
      className={
        "bg-primary w-fit text-white py-2 px-6 rounded-xl cursor-pointer hover:scale-90 active:scale-105" +
        " " +
        className
      }
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default CustomButton;
