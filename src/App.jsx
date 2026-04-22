import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get, set, update } from "firebase/database"; // ✅ Added update
import { auth, database } from "./firebase/config";
import { restoreSession, logout } from "./redux/auth/authSlice";
import Home from "./pages/home/Home";
import Login from "./pages/loginAndRegister/Login";
import Register from "./pages/loginAndRegister/Register";
import Market from "./pages/market/Market";
import MainPage from "./pages/MainPage";
import ProductInfo from "./components/products/productInfo/ProductInfo";
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
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import "./App.css";
import "./i18n";
import styles from "./AppLoader.module.css";

function App() {
  const dispatch = useDispatch();
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          await firebaseUser.reload();

          const userRef = ref(database, `users/${firebaseUser.uid}`);
          let snapshot = await get(userRef);

          const adminRef = ref(database, `admins/${firebaseUser.uid}`);
          const adminSnapshot = await get(adminRef);
          const isAdmin = adminSnapshot.exists();

          let userData;

          if (!snapshot.exists()) {
            userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || "",
              role: isAdmin ? "admin" : "client",
              emailVerified: firebaseUser.emailVerified,
              createdAt: new Date().toISOString(),
              cartInfo: { cart: [], isEmpty: true, totalPrice: 0 },
              billsHistory: [],
              age: "",
              phoneNumber: "",
              gender: "",
              address: "",
            };
            await set(userRef, userData);
          } else {
            userData = snapshot.val();
            if (isAdmin) {
              userData.role = "admin";
            }

            // ✅ Sync emailVerified with Firebase Auth and update DB if changed
            if (userData.emailVerified !== firebaseUser.emailVerified) {
              userData.emailVerified = firebaseUser.emailVerified;
              await update(userRef, { emailVerified: firebaseUser.emailVerified });
            }
          }

          const role = isAdmin ? "admin" : userData.role || "client";

          dispatch(
            restoreSession({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || userData.displayName,
              role,
              emailVerified: firebaseUser.emailVerified,
              cartInfo: userData.cartInfo || {
                cart: [],
                isEmpty: true,
                totalPrice: 0,
              },
              billsHistory: userData.billsHistory || [],
              age: userData.age || "",
              phoneNumber: userData.phoneNumber || "",
              gender: userData.gender || "",
              address: userData.address || "",
            })
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

  if (authLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-950 z-50">
        <div className={styles.spinnerWrapper}>
          <div className={styles.ring}></div>
          <div className={styles.ring}></div>
          <div className={styles.ring}></div>
          <div className={styles.dot}></div>
        </div>
        <p className="mt-6 text-sm font-medium tracking-widest text-gray-400 uppercase animate-pulse">
          Loading...
        </p>
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

          <Route element={<ProtectedRouteAdmin />}>
            <Route path="adminProfile" element={<AdminProfile />} />
            <Route path="market_management" element={<MarketManage />} />
          </Route>

          <Route path="unauthorized" element={<Unauthorized />} />
        </Route>

        <Route
          path="/verify-email"
          element={
            <PublicOnlyRoute>
              <VerifyEmail />
            </PublicOnlyRoute>
          }
        />
        <Route path="/sign_up" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="*" element={<h1>Page Not Found :(</h1>} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
