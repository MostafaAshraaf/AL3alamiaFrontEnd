import { useDispatch, useSelector } from "react-redux";
import { useState, useMemo } from "react";
import CartItem from "../../components/products/cartItem/CartItem";
import styles from "./cart.module.css";
import { useNavigate } from "react-router-dom";
import { CartOperationsApi } from "../../redux/auth/authApis";
import { useProducts } from "../../redux/products/productsApis";
import { useAddBillToUserHistory } from "../../redux/bills/billsApi";
import { successMessage, errorMessage } from "../../redux/toasts";
import { useTranslation } from "react-i18next";

function Cart() {
  const { t } = useTranslation();
  const cartData = useSelector((state) => state?.auth?.user?.cartInfo);
  const user = useSelector((state) => state?.auth?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showAccessorySelection, setShowAccessorySelection] = useState(false);
  const [customerAddress, setCustomerAddress] = useState("");
  const [selectedAccessories, setSelectedAccessories] = useState({});

  const userId = user?.uid;
  const { mutate: addBill, isLoading: isAddingBill } = useAddBillToUserHistory(userId);

  const productsQuery = useProducts();
  const productsData = productsQuery.data;

  // Calculate total price directly from cart items
  const totalPrice = useMemo(() => {
    if (!cartData?.cart || cartData.cart.length === 0) return 0;
    return cartData.cart.reduce((sum, item) => {
      const price = item.product?.price || 0;
      const quantity = item.quantity || 0;
      return sum + (price * quantity);
    }, 0);
  }, [cartData?.cart]);

  const allAccessories = useMemo(() => {
    return (
      productsData
        ?.filter((product) => product.type === "accessory")
        .map((product) => ({
          id: product.fireId,
          name: product.name,
          category: product.category,
        })) || []
    );
  }, [productsData]);

  const clearHandler = () =>
    dispatch(CartOperationsApi({ operation: "clear", data: null }));

  const hasStarterKit = () => {
    return cartData?.cart?.some(
      (item) => item.product.name === t("inkStarterKit")
    );
  };

  const getTotalSelectedAccessories = () => {
    return Object.values(selectedAccessories).reduce(
      (total, quantity) => total + quantity,
      0
    );
  };

  const handleAccessoryQuantityChange = (accessoryId, change) => {
    const currentQuantity = selectedAccessories[accessoryId] || 0;
    const newQuantity = Math.max(0, currentQuantity + change);
    const totalOthers = getTotalSelectedAccessories() - currentQuantity;
    if (totalOthers + newQuantity <= 5) {
      setSelectedAccessories((prev) => ({
        ...prev,
        [accessoryId]: newQuantity,
      }));
      if (newQuantity === 0) {
        const updatedAccessories = { ...selectedAccessories };
        delete updatedAccessories[accessoryId];
        setSelectedAccessories(updatedAccessories);
      }
    }
  };

  const createWhatsAppBill = () => {
    const billId = `bill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      id: billId,
      products: cartData?.cart?.map((item) => ({
        id: item.product.id || item.product.fireId,
        img: item.product.image || item.product.url,
        title: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      })) || [],
      totalPrice: totalPrice,
      orderDate: new Date().toISOString(),
      location: customerAddress,
      paymentMethod: "WhatsApp",
      status: "pending",
    };
  };

  const generateWhatsAppMessage = () => {
    const customerName = user?.displayName || user?.fullname || t("valuedCustomer");
    let message = `🖨️ *${t("al3alamiaComputerSupplies")} - ${t("newOrder")}* 🖨️\n\n`;
    message += `👤 *${t("customer")}:* ${customerName}\n`;
    message += `📍 *${t("address")}:* ${customerAddress}\n\n`;
    message += `🛒 *${t("orderDetails")}:*\n`;

    cartData?.cart?.forEach((item, index) => {
      message += `${index + 1}. *${item.product.name}*\n`;
      if (
        item.product.name === t("inkStarterKit") &&
        Object.keys(selectedAccessories).length > 0
      ) {
        message += `   🛠️ ${t("selectedAccessories")}:\n`;
        Object.entries(selectedAccessories).forEach(([accessoryId, quantity]) => {
          const accessory = allAccessories.find((a) => a.id === accessoryId);
          if (accessory && quantity > 0) {
            message += `      - ${accessory.name} (${accessory.category}) x${quantity}\n`;
          }
        });
        message += `   📦 ${t("totalAccessories")}: ${getTotalSelectedAccessories()}\n`;
      }
      message += `   💰 ${t("price")}: ${item.product.price} ${t("EGP")}\n`;
      message += `   🔢 ${t("quantity")}: ${item.quantity}\n`;
      message += `   💎 ${t("subtotal")}: ${(
        item.product.price * item.quantity
      ).toFixed(2)} ${t("EGP")}\n\n`;
    });

    message += `💳 *${t("orderTotal")}:* ${totalPrice.toFixed(2)} ${t("EGP")}\n\n`;
    message += `✨ ${t("thankYouForChoosingUs")} ✨`;
    return encodeURIComponent(message);
  };

  const handleWhatsAppOrder = (phoneNumber) => {
    if (!customerAddress.trim()) {
      alert(t("pleaseEnterDeliveryAddress"));
      return;
    }
    if (hasStarterKit() && getTotalSelectedAccessories() === 0) {
      alert(t("selectAtLeastOneAccessory"));
      return;
    }
    const newBill = createWhatsAppBill();
    addBill(newBill, {
      onSuccess: () => {
        successMessage(t("orderPlacedViaWhatsApp"));
        const message = generateWhatsAppMessage();
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappUrl, "_blank");
        setShowWhatsAppModal(false);
        setShowAccessorySelection(false);
      },
      onError: (error) => {
        console.error("Error saving WhatsApp order:", error);
        errorMessage(t("failedToSaveOrder"));
      },
    });
  };

  const buyHandler = () => {
    if (hasStarterKit()) {
      setShowAccessorySelection(true);
    } else {
      setShowWhatsAppModal(true);
    }
  };

  // Check if cart is empty safely
  const isEmpty = !cartData?.cart || cartData.cart.length === 0;

  return (
    <div className={styles.cartWrapper}>
      <div className={styles.backgroundElements}>
        <div className={styles.floatingCircle}></div>
        <div className={styles.floatingCircle}></div>
        <div className={styles.floatingCircle}></div>
      </div>

      <section className={styles.page}>
        <div className={`container ${styles.container}`}>
          <div className={styles.header}>
            <div className={styles.titleWrapper}>
              <h1 className={styles.pageTitle}>
                <span className={styles.titleIcon}>🛒</span>
                {t("yourCart")}
                {isEmpty && (
                  <span className={styles.emptyBadge}>{t("empty")}</span>
                )}
              </h1>
              {!isEmpty && (
                <p className={styles.itemCount}>
                  {t("itemCount", {
                    count: cartData?.cart?.length || 0,
                    items: (cartData?.cart?.length || 0) !== 1 ? t("items") : t("item"),
                  })}
                </p>
              )}
            </div>
          </div>

          {isEmpty ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🖨️</div>
              <h3>{t("yourComputerSuppliesCartIsEmpty")}</h3>
              <p>{t("browseOurPremiumProducts")}</p>
              <button
                className={styles.continueShoppingBtn}
                onClick={() => navigate("/market")}
              >
                {t("exploreAl3alamiaProducts")}
              </button>
            </div>
          ) : (
            <>
              <div className={styles.cartContent}>
                <div className={styles.itemsList}>
                  {cartData?.cart?.map((p, index) => (
                    <div
                      key={p.product.id || p.product.fireId}
                      className={styles.itemWrapper}
                      style={{ "--delay": `${index * 0.1}s` }}
                    >
                      <CartItem data={p.product} quantity={p.quantity} />
                    </div>
                  ))}
                </div>

                <div className={styles.cartSummary}>
                  <div className={styles.summaryCard}>
                    <h3 className={styles.summaryTitle}>{t("orderSummary")}</h3>
                    <div className={styles.summaryDetails}>
                      <div className={styles.summaryRow}>
                        <span>{t("subtotal")}</span>
                        <span>{totalPrice.toFixed(2)} {t("EGP")}</span>
                      </div>
                      <div className={styles.summaryDivider}></div>
                      <div className={`${styles.summaryRow} ${styles.total}`}>
                        <span>{t("total")}</span>
                        <span>{totalPrice.toFixed(2)} {t("EGP")}</span>
                      </div>
                    </div>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.buyAllBtn}
                        onClick={buyHandler}
                        disabled={isAddingBill}
                      >
                        <span className={styles.btnIcon}>💬</span>
                        {isAddingBill ? t("processing") : t("orderViaWhatsApp")}
                      </button>
                      <button className={styles.clearBtn} onClick={clearHandler}>
                        <span className={styles.btnIcon}>🗑️</span>
                        {t("clearCart")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* WhatsApp Modal - same as before */}
      {showWhatsAppModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>🖨️ {t("completeYourAl3alamiaOrder")}</h3>
              <button
                className={styles.closeModal}
                onClick={() => setShowWhatsAppModal(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.addressSection}>
                <label htmlFor="address">📍 {t("deliveryAddressLabel")}:</label>
                <textarea
                  id="address"
                  placeholder={t("deliveryAddressPlaceholder")}
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className={styles.addressInput}
                  rows={3}
                />
              </div>
              <div className={styles.orderSummary}>
                <h4>📦 {t("yourOrderDetails")}:</h4>
                {cartData?.cart?.map((item) => (
                  <div key={item.product.id || item.product.fireId} className={styles.orderItem}>
                    <span className={styles.itemName}>{item.product.name}</span>
                    <span className={styles.itemDetails}>
                      {item.product.price} {t("EGP")} × {item.quantity} ={" "}
                      {(item.product.price * item.quantity).toFixed(2)} {t("EGP")}
                    </span>
                  </div>
                ))}
                <div className={styles.orderTotal}>
                  <strong>
                    {t("total")}: {totalPrice.toFixed(2)} {t("EGP")}
                  </strong>
                </div>
              </div>
              <div className={styles.whatsappSection}>
                <p>📱 {t("selectWhatsAppNumberToSendOrder")}:</p>
                <div className={styles.whatsappButtons}>
                  <button
                    className={styles.whatsappBtn}
                    onClick={() => handleWhatsAppOrder("201140030112")}
                    disabled={isAddingBill}
                  >
                    <span className={styles.whatsappIcon}>📱</span>
                    {isAddingBill ? t("processing") : t("phoneNumber1")}
                  </button>
                  <button
                    className={styles.whatsappBtn}
                    onClick={() => handleWhatsAppOrder("201114939714")}
                    disabled={isAddingBill}
                  >
                    <span className={styles.whatsappIcon}>📱</span>
                    {isAddingBill ? t("processing") : t("phoneNumber2")}
                  </button>
                </div>
                <p className={styles.whatsappNote}>
                  💡 {t("whatsappConfirmationNote")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accessory Selection Modal - same as before */}
      {showAccessorySelection && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} style={{ maxWidth: "800px" }}>
            <div className={styles.modalHeader}>
              <h3>🛠️ {t("selectAccessoriesForYourStarterKit")}</h3>
              <button
                className={styles.closeModal}
                onClick={() => setShowAccessorySelection(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.selectionInfo}>
                <p>{t("starterKitAccessoryLimit")}</p>
                <div className={styles.selectionCounter}>
                  {t("selected")}: {getTotalSelectedAccessories()} / 5 {t("accessories")}
                </div>
              </div>
              <div className={styles.accessoryGrid}>
                {allAccessories.map((accessory) => {
                  const quantity = selectedAccessories[accessory.id] || 0;
                  const isMaxReached = getTotalSelectedAccessories() >= 5;
                  return (
                    <div
                      key={accessory.id}
                      className={`${styles.accessoryOption} ${
                        quantity > 0 ? styles.selected : ""
                      }`}
                    >
                      <div className={styles.accessoryInfo}>
                        <span className={styles.accessoryName}>{accessory.name}</span>
                        <span className={styles.accessoryCategory}>{accessory.category}</span>
                      </div>
                      <div className={styles.quantityControls}>
                        <button
                          className={styles.quantityBtn}
                          onClick={() => handleAccessoryQuantityChange(accessory.id, -1)}
                          disabled={quantity === 0}
                        >
                          -
                        </button>
                        <span className={styles.quantityDisplay}>{quantity}</span>
                        <button
                          className={styles.quantityBtn}
                          onClick={() => handleAccessoryQuantityChange(accessory.id, 1)}
                          disabled={isMaxReached && quantity === 0}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={styles.selectionActions}>
                <button
                  className={styles.confirmSelectionBtn}
                  onClick={() => {
                    if (getTotalSelectedAccessories() > 0) {
                      setShowAccessorySelection(false);
                      setShowWhatsAppModal(true);
                    } else {
                      alert(t("selectAtLeastOneAccessory"));
                    }
                  }}
                  disabled={getTotalSelectedAccessories() === 0}
                >
                  {t("confirmSelection")} ({getTotalSelectedAccessories()}/5)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
