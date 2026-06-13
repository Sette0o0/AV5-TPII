import { NavLink, Outlet } from "react-router-dom";
import { Button } from "../ui/button";

function Layout() {
  return (
    <>
      <div className="w-full h-full min-h-dvh">
        <header className="w-full flex py-1.5 px-3 dark:bg-[color-mix(var(--background),white_10%)] bg-[color-mix(var(--background),black_10%)]">
          <nav>
            <NavLink
              to={"/"}
              className={({ isActive }) => `${isActive && "*:scale-110 *:font-bold"}`}
              tabIndex={-1}
            >
              <Button variant={"link"} className="text-foreground cursor-pointer text-lg">
                Home
              </Button>
            </NavLink>
            <Nav />
          </nav>
        </header>
        <main className="w-full flex flex-col relative p-6">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default Layout;

const links = [
  { to: "/clientes", label: "Clientes" },
  { to: "/hospedagens", label: "Hospedagens" },
  { to: "/acomodacoes", label: "Acomodações" },
];

function Nav() {
  return (
    <>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => `${isActive && "*:scale-110 *:font-bold"}`}
          tabIndex={-1}
        >
          <Button variant={"link"} className="text-foreground cursor-pointer">
            {link.label}
          </Button>
        </NavLink>
      ))}
    </>
  );
}
