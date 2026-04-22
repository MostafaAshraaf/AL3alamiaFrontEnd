// VerifyEmail.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/config";
import {
  resendVerificationEmailApi,
  logoutApi,
} from "../../redux/auth/authApis";
import { LoaderBtn } from "../../components/common/loadingSpinners/Loaders";
import { useTranslation } from "react-i18next";
import styles from "./verifyEmail.module.css";
import { ref, update } from "firebase/database";
import { database } from "../../firebase/config";
import { restoreSession } from "../../redux/auth/authSlice";
const VerifyEmail = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Poll for email verification status
  useEffect(() => {
    if (!user) return;

    const checkVerification = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await currentUser.reload();
        if (currentUser.emailVerified) {
          // ✅ Update database
          const userRef = ref(database, `users/${currentUser.uid}`);
          await update(userRef, { emailVerified: true });

          // ✅ Update Redux state without reloading
          dispatch(
            restoreSession({
              ...user,
              emailVerified: true,
            }),
          );

          // Redirect after a brief delay to show success
          setTimeout(() => {
            navigate(user.role === "admin" ? "/adminProfile" : "/profile", {
              replace: true,
            });
          }, 500);
        }
      }
    };

    const interval = setInterval(checkVerification, 3000);
    return () => clearInterval(interval);
  }, [user, navigate, dispatch]);

  const handleResend = async () => {
    try {
      await dispatch(resendVerificationEmailApi()).unwrap();
      setResendDisabled(true);
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Resend failed:", error);
    }
  };
  const handleBackToLogin = async () => {
    // Log out the user first
    await dispatch(logoutApi());
    navigate("/login", { replace: true });
  };
  if (!user) return null;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Icon */}
        <div className={styles.iconBadge}>✉️</div>

        {/* Heading */}
        <h2>{t("verifyEmailTitle")}</h2>
        <div className={styles.divider} />

        {/* Body text */}
        <p>
          {t("verificationEmailSent")} <strong>{user.email}</strong>
        </p>
        <p>{t("checkInboxAndSpam")}</p>

        {/* Polling status badge */}
        <div className={styles.statusBadge}>
          <span className={styles.statusDot} />
          {t("waitingForVerification") || "Waiting for verification…"}
        </div>

        {/* Resend button */}
        <button
          onClick={handleResend}
          disabled={loading || resendDisabled}
          className={styles.resendBtn}
        >
          {loading ? (
            <LoaderBtn />
          ) : resendDisabled ? (
            <>
              ⏳ {t("resendIn")} {countdown}s
            </>
          ) : (
            <>{t("resendVerificationEmail")}</>
          )}
        </button>

        {/* Back button */}
        <button onClick={handleBackToLogin} className={styles.backBtn}>
          ← {t("backToLogin")}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
