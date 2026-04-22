// Header.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import styles from "./header.module.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutApi } from "../../../redux/auth/authApis";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaShoppingBag } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { MdLanguage } from "react-icons/md";

function Header() {
  const [activeMenu, setActiveMenu] = useState(false);
  const [activeCart, setActiveCart] = useState(false);
  const [activeAuthMenu, setActiveAuthMenu] = useState(false);

  const { t } = useTranslation();

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    toggleAll();
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const authData = useSelector((state) => state.auth);
  const user = authData?.user;
  const cartData = user?.cartInfo;

  const toggleMenu = () => {
    setActiveMenu((prev) => !prev);
    setActiveCart(false);
    setActiveAuthMenu(false);
    // Prevent body scroll when menu is open on mobile
    if (!activeMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const toggleCart = () => {
    navigate("/cart");
    toggleAll();
  };

  const toggleAuthMenu = () => {
    setActiveAuthMenu((prev) => !prev);
    setActiveCart(false);
    setActiveMenu(false);
  };

  const toggleAll = () => {
    setActiveAuthMenu(false);
    setActiveCart(false);
    setActiveMenu(false);
    document.body.style.overflow = '';
  };

  // Close menus on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        toggleAll();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Close mobile menu on window resize (if screen becomes desktop)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && activeMenu) {
        toggleAll();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeMenu]);

  const handleProfileButton = () => {
    toggleAll();
    const role = user?.role;
    if (role === "client") navigate("/profile");
    else if (role === "admin") navigate("/adminProfile");
  };

  const navStyle = ({ isActive }) =>
    isActive ? `${styles.activeNavLink}` : "navLink";

  const logoutHandler = () => {
    setActiveMenu(false);
    dispatch(logoutApi());
    navigate("/login");
  };

  const navLinks = [
    {
      path: `/${user?.role === "admin" ? "market_management" : "market"}`,
      label: t("market"),
      icon: <FaShoppingBag className="w-5 h-5" />,
      users: ["client", "admin", "gest"],
    },
  ];

  return (
    <header className={`${styles.header}`}>
      <div
        onClick={toggleAll}
        className={`${styles.overlay} ${activeMenu || activeCart || activeAuthMenu ? styles.active : ""}`}
      ></div>
      <div className={`container ${styles.container} ${authData?.isAuthenticated ? styles.isAuth : ""}`}>
        <nav className={styles.nav}>
          <Link to="/home">
            <div className={styles.logoText} onClick={toggleAll}>
              {t("siteName")}
            </div>
          </Link>

          <ul className={`${styles.headerList} ${activeMenu ? styles.active : ""}`}>
            {navLinks.map((link, index) =>
              link.users.includes(user?.role || "gest") && (
                <li key={index}>
                  <NavLink to={link.path} onClick={toggleAll} className={navStyle}>
                    <span className={styles.navIcon}>{link.icon}</span> {link.label}
                  </NavLink>
                </li>
              )
            )}
          </ul>

          <div className={styles.headerRight}>
            <div className={styles.languageSwitcher}>
              <button
                onClick={() => changeLang(i18n.language === "en" ? "ar" : "en")}
                className={styles.langBtn}
                title={i18n.language === "en" ? t("switchToArabic") : t("switchToEnglish")}
              >
                <MdLanguage className={styles.langIcon} />
                <span className={styles.langText}>
                  {i18n.language === "en" ? "العربية" : "EN"}
                </span>
              </button>
            </div>

            {authData?.isAuthenticated && user?.role === "client" && (
              <div className={styles.headerCart}>
                <button onClick={toggleCart}>
                  <span className={styles.cartIconCon}>
                    🛒
                    <span className={styles.cartNum}>
                      {cartData?.cart?.length || 0}
                    </span>
                  </span>
                  <span className={styles.label}>{t("myCart")}</span>
                </button>
              </div>
            )}

            <div className={styles.headerAuth}>
              <button onClick={toggleAuthMenu}>
                {authData?.isAuthenticated ? (
                  <span className={styles.userGreeting}>
                    <span className={styles.label}>{t("hi")}</span>
                    <span className={styles.userName}>
                      {user?.displayName || user?.fullname || "User"}
                    </span>
                  </span>
                ) : (
                  t("account")
                )}
                <MdKeyboardArrowDown className={activeAuthMenu ? styles.up : ""} />
              </button>

              <ul className={`${styles.innerAuth} ${activeAuthMenu ? styles.active : ""}`}>
                {authData?.isAuthenticated ? (
                  <>
                    <li>
                      <button onClick={handleProfileButton}>
                        👤 {t("profile")}
                      </button>
                    </li>
                    <li>
                      <button onClick={logoutHandler}>
                        🔒 {t("logout")}
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <button onClick={() => navigate("/login")}>
                        🔑 {t("login")}
                      </button>
                    </li>
                    <li>
                      <button onClick={() => navigate("/sign_up")}>
                        📝 {t("signup")}
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <button
              onClick={toggleMenu}
              className={`${styles.ul_icon} ${activeMenu ? styles.active : ""}`}
              aria-label="Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
