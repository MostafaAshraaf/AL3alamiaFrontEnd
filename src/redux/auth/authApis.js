import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { ref, set, get, update } from "firebase/database";
import { auth, database } from "../../firebase/config";
import { successMessage, errorMessage } from "../toasts";
import { updateCart } from "./authSlice";
import { sendEmailVerification } from "firebase/auth";

export const signUpApi = createAsyncThunk(
  "auth/signUp",
  async ({ email, password, displayName, ...additionalData }, thunkAPI) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // 🔐 Send verification email immediately after signup
      await sendEmailVerification(user);
      successMessage("Verification email sent. Please check your inbox.");

      if (displayName) {
        await updateProfile(user, { displayName });
      }

      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: displayName || "",
        role: "client",
        emailVerified: user.emailVerified, // false initially
        createdAt: new Date().toISOString(),
        cartInfo: { cart: [], isEmpty: true },
        billsHistory: [],
        ...additionalData,
      };

      await set(ref(database, `users/${user.uid}`), userData);

      const token = await user.getIdToken();

      const userForRedux = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: "client",
        emailVerified: user.emailVerified,
        cartInfo: userData.cartInfo,
        billsHistory: [],
      };

      localStorage.setItem(
        "user",
        JSON.stringify({ uid: user.uid, email: user.email }),
      );

      return { user: userForRedux, token };
    } catch (error) {
      // ... error handling unchanged
    }
  },
);

// New thunk: Resend verification email
export const resendVerificationEmailApi = createAsyncThunk(
  "auth/resendVerification",
  async (_, thunkAPI) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      await sendEmailVerification(user);
      successMessage("Verification email resent. Check your inbox.");
      return true;
    } catch (error) {
      let message = "Failed to resend verification email.";
      if (error.code === "auth/too-many-requests") {
        message = "Too many requests. Please try again later.";
      }
      errorMessage(message);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const loginApi = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Attempt to fetch user profile
      const userRef = ref(database, `users/${user.uid}`);
      let snapshot = await get(userRef);

      let userData;
      let isAdmin = false;

      // Check admin status regardless of whether user document exists
      const adminSnapshot = await get(ref(database, `admins/${user.uid}`));
      isAdmin = adminSnapshot.exists();

      if (!snapshot.exists()) {
        // Create default user document for manually created users (e.g., admins)
        const defaultUserData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "",
          role: isAdmin ? "admin" : "client",
          createdAt: new Date().toISOString(),
          cartInfo: { cart: [], isEmpty: true },
          billsHistory: [],
        };
        await set(userRef, defaultUserData);
        userData = defaultUserData;
      } else {
        userData = snapshot.val();
        // Ensure role is consistent with admin node
        if (isAdmin) {
          userData.role = "admin";
        }
      }

      const token = await user.getIdToken();
      // In loginApi (authApis.js)
      const userForRedux = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || userData.displayName,
        role: isAdmin ? "admin" : userData.role || "client",
        emailVerified: user.emailVerified, // ✅ ADD THIS
        cartInfo: userData.cartInfo || {
          cart: [],
          isEmpty: true,
        },
        billsHistory: userData.billsHistory || [],
      };

      localStorage.setItem(
        "user",
        JSON.stringify({ uid: user.uid, email: user.email }),
      );

      return { user: userForRedux, token };
    } catch (error) {
      let message = "Login failed";
      if (error.code === "auth/user-not-found") {
        message = "No account found with this email";
      } else if (error.code === "auth/wrong-password") {
        message = "Incorrect password";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email format";
      }
      errorMessage(message);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const logoutApi = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      return true;
    } catch (error) {
      errorMessage("Logout failed");
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const CartOperationsApi = createAsyncThunk(
  "auth/CartOperations",
  async ({ operation, data }, thunkAPI) => {
    const state = thunkAPI.getState().auth;
    const uid = state.user?.uid;
    if (!uid) return thunkAPI.rejectWithValue("User not authenticated");

    const cartRef = ref(database, `users/${uid}/cartInfo`);

    try {
      const snapshot = await get(cartRef);
      let cartInfo = snapshot.exists()
        ? snapshot.val()
        : { cart: [], isEmpty: true};

      if (!cartInfo.cart) cartInfo.cart = [];

      const productId = data?.id || data?.fireId || data; // For remove/increase/decrease, data may be just ID string

      switch (operation) {
        case "add": {
          const existingItem = cartInfo.cart.find(
            (item) => (item.product.id || item.product.fireId) === productId,
          );
          if (existingItem) {
            existingItem.quantity += 1;
          } else {
            cartInfo.cart.push({
              product: { ...data },
              quantity: 1,
            });
          }
          cartInfo.isEmpty = cartInfo.cart.length === 0;
          successMessage("Added to cart");
          break;
        }
        case "remove": {
          const index = cartInfo.cart.findIndex(
            (item) => (item.product.id || item.product.fireId) === data,
          );
          if (index !== -1) {
            cartInfo.cart.splice(index, 1);
            cartInfo.isEmpty = cartInfo.cart.length === 0;
            successMessage("Removed from cart");
          }
          break;
        }
        case "increase": {
          const item = cartInfo.cart.find(
            (item) => (item.product.id || item.product.fireId) === data,
          );
          if (item) {
            item.quantity += 1;
          }
          break;
        }
        case "decrease": {
          const item = cartInfo.cart.find(
            (item) => (item.product.id || item.product.fireId) === data,
          );
          if (item && item.quantity > 1) {
            item.quantity -= 1;
          } else if (item && item.quantity === 1) {
            cartInfo.cart = cartInfo.cart.filter(
              (item) => (item.product.id || item.product.fireId) !== data,
            );
          }
          cartInfo.isEmpty = cartInfo.cart.length === 0;
          break;
        }
        case "clear": {
          cartInfo = { cart: [], isEmpty: true };
          successMessage("Cart cleared");
          break;
        }
        default:
          return thunkAPI.rejectWithValue("Invalid operation");
      }

      await set(cartRef, cartInfo);
      thunkAPI.dispatch(updateCart(cartInfo));
      return cartInfo;
    } catch (error) {
      console.error("Cart operation error:", error);
      errorMessage("Failed to update cart");
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const updateUserDataApi = createAsyncThunk(
  "auth/updateUserData",
  async (userData, thunkAPI) => {
    const state = thunkAPI.getState().auth;
    const uid = state.user?.uid;
    if (!uid) return thunkAPI.rejectWithValue("Not authenticated");

    try {
      const userRef = ref(database, `users/${uid}`);
      await update(userRef, userData);

      const updatedSnapshot = await get(userRef);
      const updatedUser = {
        ...state.user,
        ...updatedSnapshot.val(),
      };

      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      stored.email = updatedUser.email;
      localStorage.setItem("user", JSON.stringify(stored));

      successMessage("Profile updated");
      return updatedUser;
    } catch (error) {
      errorMessage("Failed to update profile");
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
