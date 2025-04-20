import { useRef } from "react";
import { userStore } from "../../zustand/userStore";

function Header() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { user, role } = userStore();

  const renderAvatar = () => {
    switch (role) {
      case "patient":
        return (
          <img
            src="/images/patientAvatar.svg"
            className="size-12 rounded-full"
          />
        );
      case "doctor":
        return (
          <img
            src="/images/doctorAvatar.jpg"
            className="size-10 rounded-full"
          />
        );
      case "owner":
        return (
          <img src="/images/adminAvatar.jpg" className="size-12 rounded-full" />
        );
    }
  };
  return (
    <header className="w-full pt-3 pr-7 pl-3">
      <div className="flex justify-between w-full items-center ">
        <h1 className="font-secondary text-5xl font-semibold text-primary">Sanova</h1>

        <div className="flex items-center gap-10">
          <div className="relative search">
            <img
              className="absolute top-[30%] right-3 opacity-50 hover:opacity-100 transition cursor-pointer"
              src="/images/search.svg"
            />
            <input
              placeholder="search"
              ref={inputRef}
              className="border border-gray-400 rounded-md py-3 px-3 w-100 placeholder:text-md"
            />
          </div>

          <div className="avatar flex border py-1 px-3 rounded-2xl border-gray-400">
            <div className="flex items-center gap-3">
              {renderAvatar()}
              <div>
                <p className="font-bold text-md font-poppins">
                  {user?.split(" ")[0]}
                </p>
                <p className="text-sm font-poppins text-gray-400">{role}</p>
              </div>
              <img
                src="/images/arrow-down.svg"
                className="cursor-pointer opacity-50 transition hover:opacity-100"
              />
            </div>

            <img
              src="/images/bell.svg"
              className="cursor-pointer border-gray-400 opacity-50 transition hover:opacity-100"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
