import { Link, routes } from "@redwoodjs/router";
import { Toaster } from "@redwoodjs/web/toast";

const RoomsLayout = ({ children }) => {
  return (
    <div className="rw-scaffold">
      <Toaster toastOptions={{ className: "rw-toast", duration: 6000 }} />
      <header className="rw-header">
        <h1 className="rw-heading rw-heading-primary">
          <Link to={routes.rooms()} className="rw-link">
            Rooms
          </Link>
        </h1>
        <Link to={routes.newRoom()} className="rw-button rw-button-green">
          <div className="rw-button-icon">+</div> New Room
        </Link>
      </header>
      <main className="rw-main">{children}</main>
    </div>
  );
};

export default RoomsLayout;
