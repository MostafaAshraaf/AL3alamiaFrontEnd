import { useQuery } from "@tanstack/react-query";
import { ref, get } from "firebase/database";
import { database } from "../../firebase/config";

// Get list of admin UIDs
const getAdmins = async () => {
  try {
    const snapshot = await get(ref(database, "admins"));
    if (!snapshot.exists()) return [];
    // Return array of UIDs that are admins
    return Object.keys(snapshot.val());
  } catch (error) {
    console.error("Fetch Admins Error:", error);
    return [];
  }
};

export const useAdmins = () => {
  return useQuery({
    queryKey: ["admins"],
    queryFn: getAdmins,
    staleTime: 1000 * 60 * 5,
  });
};

// Get all users with role info (admin only, should be protected by security rules)
const getUsersWithRoles = async () => {
  try {
    const usersSnapshot = await get(ref(database, "users"));
    if (!usersSnapshot.exists()) return [];

    const users = [];
    const adminsSnapshot = await get(ref(database, "admins"));
    const admins = adminsSnapshot.exists() ? Object.keys(adminsSnapshot.val()) : [];

    usersSnapshot.forEach((child) => {
      const userData = child.val();
      users.push({
        uid: child.key,
        ...userData,
        isAdmin: admins.includes(child.key),
      });
    });
    return users;
  } catch (error) {
    console.error("Fetch Users Error:", error);
    return [];
  }
};

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsersWithRoles,
    staleTime: 1000 * 60 * 5,
  });
};

// Helper function to check if current user is admin (client-side)
export const checkIsAdmin = (uid, adminsList) => {
  return adminsList.includes(uid);
};