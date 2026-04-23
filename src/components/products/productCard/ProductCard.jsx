import { useNavigate } from "react-router-dom";
import styles from "./productCard.module.css";
import useCart from "../../../hooks/useCart";
import React from "react";
import { useSelector } from "react-redux";
import {
  FaMouse,
  FaKeyboard,
  FaPlug,
  FaSquare,
  FaPrint,
  FaGamepad,
  FaVolumeUp,
  FaTint,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
function ProductCard({ data, children }) {
  const { t } = useTranslation();

  const { fireId, name, description, image, type } = data;

  const { inCart, addToCartHandler, removeFromCartHandler } = useCart(data);
  const userRole = useSelector((state) => state?.auth?.user?.role);
  const navigate = useNavigate();

  // الانتقال باستخدام المعرف اللي جاي من فايربيز
  // لو البيانات جاية مصفوفة، الـ fireId اللي عملناه في الـ API هيكون هو الـ index
  const productInfoHandler = () =>
    navigate(`/market/${data.fireId ?? data.id}`);
  return (
    <div className={styles.card}>
      <div className={styles.image_con} onClick={productInfoHandler}>
        <div className={styles.top}>
          <div className={styles.type_badge}>{t(type)}</div>
        </div>
        {/* التأكد من وجود الصورة */}
        <img
          src={image}
          className={styles.product_image}
          alt={name}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/150";
          }} // صورة بديلة لو المسار غلط
        />
      </div>
      <div className={styles.data}>
        <h2 className={styles.box_title} onClick={productInfoHandler}>
          {name}
        </h2>
        {/* التأكد من وجود الوصف قبل عمل slice */}
        <p className={styles.desc}>
          {description ? description.slice(0, 50) : "No description available"}
          ...
        </p>
        <div className={styles.main}>
          <p className={styles.price}>
            Available
          </p>
          {userRole === "admin" ? (
            children
          ) : (
            <button
              className={`${styles.cart_btn} ${inCart ? styles.add_to_cart : styles.remove_from_cart}`}
              onClick={inCart ? removeFromCartHandler : addToCartHandler}
            >
              {inCart ? t("removeFromCart") : t("addToCart")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(ProductCard);
