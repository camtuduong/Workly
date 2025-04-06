import { Outlet } from "react-router-dom";
import Drawer from "../../components/Drawer";
import { useState } from "react";
import NavbarIn from "../../components/NavbarIn";

const DashboardLayout = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  return (
    <div className="relative h-screen overflow-hidden">
      <NavbarIn />

      <div className="flex h-full pt-16">
        <Drawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
        <main
          className={`flex h-full min-h-0 flex-1 flex-col overflow-hidden transition-all duration-300 ${
            isDrawerOpen ? "pl-72" : "pl-6"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
