import { ModeToggle } from "./mode-toggle";

const Sidebar = () => {
  return (
    <div className="hidden min-w-[250px] lg:block">
      Sidebar
      <ModeToggle />
    </div>
  );
};

export default Sidebar;
