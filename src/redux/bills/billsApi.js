import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ref, get, update, push } from "firebase/database";
import { database } from "../../firebase/config";
import { successMessage, errorMessage } from "../toasts";

const getUserBillsHistory = async (userId) => {
  if (!userId) return [];
  try {
    const snapshot = await get(ref(database, `users/${userId}/billsHistory`));
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Array.isArray(data) ? data : Object.values(data);
    }
    return [];
  } catch (error) {
    console.error("Error fetching bills history:", error);
    return [];
  }
};

export const useUserBillsHistory = (userId) => {
  return useQuery({
    queryKey: ["userBillsHistory", userId],
    queryFn: () => getUserBillsHistory(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};

const addBillToUserHistory = async ({ userId, newBill }) => {
  try {
    const userRef = ref(database, `users/${userId}`);
    const userSnapshot = await get(userRef);
    if (!userSnapshot.exists()) {
      throw new Error("User not found");
    }

    const userData = userSnapshot.val();
    
    const billsHistoryRaw = userData.billsHistory || {};
    const currentBills = Array.isArray(billsHistoryRaw)
      ? billsHistoryRaw
      : Object.values(billsHistoryRaw);

    const billsRef = ref(database, `users/${userId}/billsHistory`);
    const newBillRef = push(billsRef);
    const billWithId = {
      ...newBill,
      id: newBillRef.key,
      createdAt: new Date().toISOString(),
    };

    let updatedCart = userData.cartInfo || { cart: [], isEmpty: true };
    if (newBill.paymentMethod === "WhatsApp" || newBill.clearCart) {
      updatedCart = { cart: [], isEmpty: true};
    }

    const updates = {};
    updates[`users/${userId}/billsHistory/${newBillRef.key}`] = billWithId;
    updates[`users/${userId}/cartInfo`] = updatedCart;
    await update(ref(database), updates);

    return {
      ...userData,
      billsHistory: [...currentBills, billWithId],
      cartInfo: updatedCart,
    };
  } catch (error) {
    console.error("Error adding bill:", error);
    throw error;
  }
};

export const useAddBillToUserHistory = (userId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newBill) => addBillToUserHistory({ userId, newBill }),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries(["userBillsHistory", userId]);
      queryClient.invalidateQueries(["cart", userId]);
      successMessage("Order saved successfully");
      return updatedUser;
    },
    onError: (error) => {
      console.error("Failed to add bill:", error);
      errorMessage("Failed to save order. Please try again.");
    },
  });
};
