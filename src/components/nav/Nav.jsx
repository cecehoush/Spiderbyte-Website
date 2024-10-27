import "./Nav.css";
import { Link, useLocation } from "react-router-dom";
import { Search as SearchIcon, Menu, X } from "lucide-react";
import { useState } from "react";
import Logo from "../../assets/SpiderByteLogo 1.png";
import Cat from "../../assets/cat.jpg";
import Web from "../../assets/spider web.png";

function Nav() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="nav-container">
      <nav>
        <div className="nav-section left">
          <Link to="/" className="logo-link">
            <img src={Logo} className="logo" alt="Logo" />
          </Link>
          
          <div className="links">
            <Link to="/" className={location.pathname == "/" ? "active" : ""}>
              Home
            </Link>
            <Link
              to="/subjects"
              className={location.pathname == "/subjects" ? "active" : ""}
            >
              Subjects
            </Link>
            <Link
              to="/interviews"
              className={location.pathname == "/interviews" ? "active" : ""}
            >
              Interviews
            </Link>
          </div>
        </div>

        <Link to="/challenge" className="challengeButton">
          <div>Daily Challenge</div>
          <img src={Web} className="web" alt="Web" />
        </Link>

        <div className="nav-section right">
          <div className="searchAndProfile">
            <div className="search">
              <SearchIcon size={24} strokeWidth={2} className="search-icon" />
              <input 
                type="text"
                placeholder="Search"
                className="search-input"
              />
            </div>
            <Link to="/profile" className="profile">
              <img src={Cat} className="cat" alt="Profile" />
            </Link>
          </div>
        </div>

        <button className="mobile-menu" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? (
            <X size={24} color="#FFFFFF" />
          ) : (
            <Menu size={24} color="#FFFFFF" />
          )}
        </button>
      </nav>

      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <div className="mobile-search">
            <SearchIcon size={24} strokeWidth={2} className="search-icon" />
            <input 
              type="text"
              placeholder="Search"
              className="search-input"
            />
          </div>
          
          <div className="mobile-links">
            <Link 
              to="/" 
              className={location.pathname == "/" ? "active" : ""}
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            <Link
              to="/subjects"
              className={location.pathname == "/subjects" ? "active" : ""}
              onClick={toggleMobileMenu}
            >
              Subjects
            </Link>
            <Link
              to="/interviews"
              className={location.pathname == "/interviews" ? "active" : ""}
              onClick={toggleMobileMenu}
            >
              Interviews
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nav;