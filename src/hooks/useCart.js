import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { CartOperationsApi } from "../redux/auth/authApis";

function useCart(product) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authData = useSelector((state) => state.auth);
  const cartInfo = useSelector((state) => state.auth?.user?.cartInfo);

  const inCart = useMemo(() => {
    return cartInfo?.cart?.some((p) => p.product.id === product?.id || p.product.fireId === product?.fireId);
  }, [cartInfo?.cart, product?.id, product?.fireId]);

  const loginRedirectHandler = useCallback(() => {
    if (!authData?.user?.uid) {
      navigate("/login");
      toast.info("Please Login First");
      return true;
    }
    return false;
  }, [authData?.user?.uid, navigate]);

  const addToCartHandler = useCallback(async () => {
    try {
      if (loginRedirectHandler()) return;
      const res = await dispatch(CartOperationsApi({ operation: "add", data: product })).unwrap();
      return res;
    } catch (error) {
      console.log(error);
    }
  }, [loginRedirectHandler, dispatch, product]);

  const removeFromCartHandler = useCallback(async () => {
    try {
      const productId = product?.id || product?.fireId;
      const res = await dispatch(CartOperationsApi({ operation: "remove", data: productId })).unwrap();
      return res;
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, product?.id, product?.fireId]);

  return {
    inCart,
    addToCartHandler,
    removeFromCartHandler,
  };
}

export default useCart;