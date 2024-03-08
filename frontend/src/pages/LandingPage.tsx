/* This will be our landing page where we have to show a hero section along with details of the project */
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="container flex gap-4">
      <Link className="hover:text-primary hover:underline" to="/notes">
        Notes
      </Link>
      <Link className="hover:text-primary hover:underline" to="/signup">
        Signup
      </Link>
      <Link className="hover:text-primary hover:underline" to="/signin">
        Signin
      </Link>
    </div>
  );
};

export default LandingPage;
