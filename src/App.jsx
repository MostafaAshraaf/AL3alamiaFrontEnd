import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get ,set} from "firebase/database";
import { auth, database } from "./firebase/config";
import { restoreSession, logout } from "./redux/auth/authSlice";
import Home from "./pages/home/Home";
import Login from "./pages/loginAndRegister/Login";
import Register from "./pages/loginAndRegister/Register";
import Market from "./pages/market/Market";
import MainPage from "./pages/MainPage";
import ProductInfo from "./components/products/productInfo/ProductInfo";
import ProtectedRoute from "./routes/ProtectedRoute";
import Cart from "./pages/cart/Cart";
import CheckOutProtected from "./routes/CheckOutProtected";
import Checkout from "./pages/checkout/Checkout";
import Unauthorized from "./pages/Unauthorized";
import VerifyEmail from "./pages/verifyEmail/VerifyEmail";
import Profile from "./pages/profile/Profile";
import AdminProfile from "./pages/adminProfile/AdminProfile";
import MarketManage from "./pages/marketManage/MarketManage";
import ProtectedRouteUser from "./routes/ProtectedRouteUser";
import ProtectedRouteAdmin from "./routes/ProtectedRouteAdmen";
import "./App.css";
import "./i18n";
// import { useTranslation } from "react-i18next";

function App() {
  const dispatch = useDispatch();
  const [authLoading, setAuthLoading] = useState(true);
  // const location = useLocation();
  // const { isAuthenticated } = useSelector((state) => state.auth);

  // Firebase Auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Inside App.jsx onAuthStateChanged
      if (firebaseUser) {
        try {
          console.log("Reading user data for UID:", firebaseUser.uid);
          const userRef = ref(database, `users/${firebaseUser.uid}`);
          let snapshot = await get(userRef);

          // Check admin status
          const adminRef = ref(database, `admins/${firebaseUser.uid}`);
          const adminSnapshot = await get(adminRef);
          const isAdmin = adminSnapshot.exists();

          let userData;

          if (!snapshot.exists()) {
            // Create default document for manually added users
            userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || "",
              role: isAdmin ? "admin" : "client",
              createdAt: new Date().toISOString(),
              cartInfo: { cart: [], isEmpty: true, totalPrice: 0 },
              billsHistory: [],
            };
            await set(userRef, userData);
          } else {
            userData = snapshot.val();
            // Optionally sync role with admin node
            if (isAdmin) {
              userData.role = "admin";
            }
          }

          const role = isAdmin ? "admin" : userData.role || "client";

          dispatch(
            restoreSession({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || userData.displayName,
              role,
              cartInfo: userData.cartInfo || {
                cart: [],
                isEmpty: true,
                totalPrice: 0,
              },
              billsHistory: userData.billsHistory || [],
            }),
          );
        } catch (error) {
          console.error("Failed to restore session:", error);
          dispatch(logout());
        }
      } else {
        dispatch(logout());
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  // Language initialization
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = savedLang;
  }, []);

  // Show loading indicator while auth is initializing
  if (authLoading) {
    return (
      <div className="app-loading">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<MainPage />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="market" element={<Market />} />
          <Route path="market/:id" element={<ProductInfo />} />

          {/* Client Routes */}
          <Route element={<ProtectedRouteUser />}>
            <Route path="cart" element={<Cart />} />
            <Route
              path="checkout"
              element={
                <CheckOutProtected>
                  <Checkout />
                </CheckOutProtected>
              }
            />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRouteAdmin />}>
            <Route path="adminProfile" element={<AdminProfile />} />
            <Route path="market_management" element={<MarketManage />} />
          </Route>

          {/* Unauthorized inside layout? Better to move outside */}
          <Route path="unauthorized" element={<Unauthorized />} />
        </Route>

        {/* Public auth routes */}
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/sign_up" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Catch-all */}
        <Route path="*" element={<h1>Page Not Found :(</h1>} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
