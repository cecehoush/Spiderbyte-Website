import "./Nav.css";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/SpiderByteLogo 1.png";
import Cat from "../../assets/cat.jpg";
import Web from "../../assets/spider web.png";

function Nav() {
  const location = useLocation();

  return (
    <>
      <nav>
        <Link to="/">
          <img src={Logo} className="logo" />
        </Link>

        <Link to="/challenge" className="challengeButton">
          <div>Daily Challenge</div>
          <img src={Web} className="web" />
        </Link>

        <div className="links">
          <Link to="/" className={location.pathname == "/" && "active"}>
            Home
          </Link>

          <Link
            to="/subjects"
            className={location.pathname == "/subjects" && "active"}
          >
            Subjects
          </Link>
        </div>

        <div className="searchAndProfile">
          <div className="search">Search</div>
          <Link to="/profile" className="profile">
            <img src={Cat} className="cat" />
          </Link>
        </div>
      </nav>
    </>
  );
}

export default Nav;
