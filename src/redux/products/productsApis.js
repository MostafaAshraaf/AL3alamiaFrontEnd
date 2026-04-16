import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ref, get, set, update, push, remove } from "firebase/database";
import { database } from "../../firebase/config";

const productsRef = ref(database, "products");

// 1. Fetch all products (excluding soft-deleted ones)
const getProducts = async () => {
  try {
    const snapshot = await get(productsRef);
    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    // Convert to array and filter out deleted products
    return Object.entries(data)
      .map(([key, value]) => ({ fireId: key, ...value }))
      .filter(product => !product.deleted); // Soft delete filter
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 5,
  });
};

// 2. Fetch single product by ID
export const useProductById = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) return null;
      const snapshot = await get(ref(database, `products/${id}`));
      if (!snapshot.exists()) return null;
      const product = snapshot.val();
      if (product.deleted) return null;
      return { fireId: id, ...product };
    },
    enabled: !!id,
  });
};

// 3. Add new product
const addProduct = async (productData) => {
  const newProductRef = push(productsRef);
  const productWithMeta = {
    ...productData,
    createdAt: new Date().toISOString(),
    deleted: false,
  };
  await set(newProductRef, productWithMeta);
  return { id: newProductRef.key, ...productWithMeta };
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProduct,
    onSuccess: () => queryClient.invalidateQueries(["products"]),
  });
};

// 4. Update product
const updateProduct = async ({ fireId, ...productData }) => {
  const productRef = ref(database, `products/${fireId}`);
  const updates = {
    ...productData,
    updatedAt: new Date().toISOString(),
  };
  await update(productRef, updates);
  return { fireId, ...updates };
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => queryClient.invalidateQueries(["products"]),
  });
};

// 5. Soft delete product
const deleteProduct = async (fireId) => {
  const productRef = ref(database, `products/${fireId}`);
  await update(productRef, {
    deleted: true,
    deletedAt: new Date().toISOString(),
  });
  return fireId;
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries(["products"]),
  });
};

// Optional: Hard delete (admin only, use with caution)
const hardDeleteProduct = async (fireId) => {
  await remove(ref(database, `products/${fireId}`));
};

export const useHardDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: hardDeleteProduct,
    onSuccess: () => queryClient.invalidateQueries(["products"]),
  });
};