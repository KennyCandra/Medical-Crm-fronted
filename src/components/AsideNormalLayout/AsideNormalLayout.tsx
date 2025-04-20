import { NavLink, useLocation } from "react-router-dom";

const navLinkVar = [
  {
    id: 1,
    path: "/profile",
    name: "Home",
  },
  {
    id: 2,
    path: "/prescription",
    name: "Prescription",
  },
  {
    id: 3,
    path: "/analytics",
    name: "Analytics",
  },
];

function AsideNormalLayout() {
  const location = useLocation();
  return (
    <div>
      {" "}
      <aside className="h-screen bg-primary flex flex-col gap-10 w-44 justify-center items-center">
        <img src="/images/logo-2.png" className="pt-20 w-15 h-40" />
        <nav className="h-full w-full items-end flex flex-col gap-10 ">
          {navLinkVar.map((link) => (
            <NavLink
              key={link.id}
              to={link.path}
              className={() =>
                `${
                  location.pathname.includes(link.path) ? "bg-white" : ""
                } w-[80%] pl-3 rounded-l-2xl font-bold py-3`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </div>
  );
}

export default AsideNormalLayout;
