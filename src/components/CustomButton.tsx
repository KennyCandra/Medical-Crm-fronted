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
