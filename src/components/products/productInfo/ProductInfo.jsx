import { useState, useRef, useCallback } from "react";
import styles from "./productInfo.module.css";
import {
  FaShoppingCart,
  FaArrowLeft,
  FaStar,
  FaStarHalfAlt,
  FaTint,
  FaPrint,
  FaBox,
  FaDesktop,
  FaKeyboard,
  FaMouse,
  FaPlug,
  FaSquare,
  FaGamepad,
  FaVolumeUp,
} from "react-icons/fa";
import useCart from "../../../hooks/useCart";
import { useNavigate, useParams } from "react-router-dom";
import { useProductById } from "../../../redux/products/productsApis";
import { useSelector } from "react-redux";
import Review from "../review/Review";
import PostReviewCon from "../postsAndReviewsContainer/PostReviewCon";
import { useTranslation } from "react-i18next";

const ProductInfo = () => {
  const { t } = useTranslation();
  const { id: productid } = useParams();
  const navigate = useNavigate();

  // --- ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS ---
  const { data, isPending, error } = useProductById(productid);
  const cartData = useCart(data);
  const userRole = useSelector((state) => state?.auth?.user?.role);

  // --- Zoom hooks - moved to top ---
  const [zoomEnabled, setZoomEnabled] = useState(false);
  const [zoomActive, setZoomActive] = useState(false);
  const [mousePercent, setMousePercent] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  // Zoom handlers
  const handleMouseMove = useCallback(
    (e) => {
      if (!zoomEnabled || !imageRef.current) return;
      const rect = imageRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePercent({
        x: Math.min(Math.max(x, 0), 1),
        y: Math.min(Math.max(y, 0), 1),
      });
    },
    [zoomEnabled],
  );

  const handleMouseEnter = useCallback(() => {
    if (zoomEnabled) setZoomActive(true);
  }, [zoomEnabled]);

  const handleMouseLeave = useCallback(() => {
    setZoomActive(false);
  }, []);

  // --- Conditional returns AFTER all Hooks ---
  // Loading state
  if (isPending)
    return <div className={styles.loading}>Loading product details...</div>;

  // Error state
  if (error)
    return <div className={styles.error}>Error loading product details.</div>;

  // No data
  if (!data) return <div className={styles.error}>Product not found.</div>;

  const {
    name,
    price,
    description,
    image,
    stock,
    brand,
    type,
    category,
    rating,
  } = data || {};

  const { inCart, addToCartHandler, removeFromCartHandler } = cartData || {};

  const stockStatus =
    stock > 5
      ? t("inStock")
      : stock === 0
        ? t("outOfStock")
        : t("onlyLeft", { count: stock });

  const stockClass =
    stock > 5
      ? styles.available
      : stock === 0
        ? styles.notAvailable
        : styles.lowStock;

  // Get product icon based on type
  const getProductIcon = (type) => {
    switch (type) {
      case "Mouse":
        return <FaMouse />;
      case "Keyboard":
        return <FaKeyboard />;
      case "Cables":
        return <FaPlug />;
      case "Mouse Pad":
        return <FaSquare />;
      case "Game Pad":
        return <FaGamepad />;
      case "Speakers":
        return <FaVolumeUp />;
      case "Printers":
        return <FaPrint />;
      case "Inks":
        return <FaTint />;
      case "Cartridges":
        return <FaPrint />;
      default:
        return <FaBox className={styles.typeIcon} />;
    }
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className={styles.star} />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className={styles.star} />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className={styles.emptyStar} />);
    }

    return stars;
  };

  const fieldsToDisplay = [
    { label: t("productName"), value: name },
    { label: t("brand"), value: brand },
    { label: t("description"), value: description },
    // { label: t("compatibility"), value: compatibility },
    // { label: t("unitsSold"), value: sales },
  ].filter(({ value }) => value && value.toString().toLowerCase() !== "none");

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={`${styles.imageContainer}`}>
            <div className={styles.imageWrapper}>
              <img
                ref={imageRef}
                src={image}
                alt={name}
                className={styles.productImage}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
              <div className={styles.productTypeBadge}>
                {getProductIcon(type)}
                <span>{t(type) || "Accessory"}</span>
              </div>

              {/* Zoom Toggle Button */}
              <button
                className={styles.zoomButton}
                onClick={() => setZoomEnabled(!zoomEnabled)}
              >
                {zoomEnabled ? "Disable Zoom" : "Enable Zoom"}
              </button>

              {/* Zoom Lens */}
              {zoomEnabled && zoomActive && (
                <div
                  className={styles.zoomLens}
                  style={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: `${
                      imageRef.current ? imageRef.current.clientWidth * 2.5 : 0
                    }px ${
                      imageRef.current ? imageRef.current.clientHeight * 2.5 : 0
                    }px`,
                    backgroundPosition: `-${
                      mousePercent.x *
                        (imageRef.current
                          ? imageRef.current.clientWidth * 2.5
                          : 0) -
                      75
                    }px -${
                      mousePercent.y *
                        (imageRef.current
                          ? imageRef.current.clientHeight * 2.5
                          : 0) -
                      75
                    }px`,
                    top: `${
                      mousePercent.y *
                      (imageRef.current ? imageRef.current.clientHeight : 0)
                    }px`,
                    left: `${
                      mousePercent.x *
                      (imageRef.current ? imageRef.current.clientWidth : 0)
                    }px`,
                  }}
                />
              )}
            </div>
          </div>

          <div className={`${styles.infoContainer}`}>
            <div className={styles.header}>
              <div>
                <h1 className={styles.title}>{name}</h1>
                <div className={styles.brandTag}>{brand || "AL 3ALAMIA"}</div>
              </div>
            </div>

            <div className={styles.stockStatus}>
              <span className={styles.stockLabel}>{t("availability")}:</span>
              <span className={`${styles.stockValue} ${stockClass}`}>
                {t(stockStatus)}
              </span>
            </div>

            <div className={styles.fieldsGrid}>
              {fieldsToDisplay.map(({ label, value }) => (
                <div
                  key={label}
                  className={
                    label === "DESCRIPTION" || label === t("description")
                      ? `${styles.field} ${styles.field_desc}`
                      : styles.field
                  }
                >
                  <span className={styles.label}>{label}:</span>
                  <span className={styles.value}>{value}</span>
                </div>
              ))}
            </div>

            {/* Rating section in info */}
            {/* {rating && (
              <div className={styles.ratingSection}>
                <span className={styles.label}>{t("customerRating")}:</span>
                <div className={styles.ratingInfo}>
                  <div className={styles.starsContainer}>
                    {renderStars(rating)}
                  </div>
                  <span className={styles.ratingText}>
                    {rating} {t("outOfFiveStars")}
                  </span>
                  {reviews && reviews.length > 0 && (
                    <span className={styles.reviewCount}>
                      ({reviews.length} review
                      {reviews.length !== 1 ? "s" : ""})
                    </span>
                  )}
                </div>
              </div>
            )} */}
            <div className={styles.priceContainer}>
              <div className={styles.price}>
                {price} {t("EGP")}
              </div>
              <button
                className={`${styles.button} ${
                  inCart ? styles.remove : styles.add
                }`}
                onClick={
                  ["admin", "doctor"].includes(userRole)
                    ? () =>
                        navigate(
                          `/${
                            userRole === "admin"
                              ? "market_management"
                              : "market"
                          }`,
                        )
                    : inCart
                      ? removeFromCartHandler
                      : addToCartHandler
                }
                disabled={
                  stock === 0 && !["admin", "doctor"].includes(userRole)
                }
              >
                <FaShoppingCart className="mr-2" />
                {["admin"].includes(userRole)
                  ? "Return To Store"
                  : stock === 0
                    ? t("outOfStock")
                    : inCart
                      ? t("removeFromCart")
                      : t("addToCart")}
              </button>
            </div>
            {!["admin"].includes(userRole) && (
              <button
                onClick={() => navigate(-1)}
                className={styles.backButton}
                aria-label="Back to Store"
              >
                <FaArrowLeft className="mr-2" />
                {t("BackToStore")}
              </button>
            )}
          </div>
        </div>
      </div>
      {/*  
      <div className={`${styles.productReviewsContainer}`}>
          <PostReviewCon
          title="Product Reviews"
          data={reviews || []}
          Component={Review}
          type="review"
        /> 
      </div>*/}
    </div>
  );
};

export default ProductInfo;
