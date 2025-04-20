import { useEffect, useRef } from "react";

type props = {
  searchValue: string;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  openModal: boolean;
  children: React.ReactNode;
  searchingTopic: string;
};

function CustomDropDownMenu({
  searchValue,
  setOpenModal,
  setSearchValue,
  openModal,
  children,
  searchingTopic,
}: props) {
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown container

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenModal(false); // Close the dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpenModal]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="w-auto space-x-3">
        <label htmlFor="searchingTopic">{searchingTopic}</label>
        <input
          type="text"
          className="border rounded"
          name={searchingTopic}
          value={searchValue}
          onFocus={() => setOpenModal(true)}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      <div className="absolute bg-[#f1f1f1] hover:bg-[#f0f0f0] min-w-40 overflow-auto z-[1]">
        {openModal && children}
      </div>
    </div>
  );
}

export default CustomDropDownMenu;
