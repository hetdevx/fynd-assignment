import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./cart-preview-modal.less";

const CartPreviewModal = ({
  isOpen = false,
  onClose,
  cartItems = [],
  breakUpValues = {},
  onGotoCheckout = () => {},
  onAddToCart = () => {},
  displayType = "modal",
}) => {
  console.log(
    "CartPreviewModal isOpen:",
    isOpen,
    !cartItems?.length,
    displayType
  );

  // Click outside to close
  const modalRef = useRef();
  const navigate = useNavigate();

  // Re-enable click outside to close functionality
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (modalRef.current && !modalRef.current.contains(event.target)) {
  //       onClose();
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [onClose]);

  const getProductPrice = (item, key) => {
    const price = item.price_per_unit?.converted;
    const quantity = item.quantity || 1;
    return `${price?.currency_symbol} ${(price?.[key] * 1 || "").toFixed(2)}`;
  };

  // Get subtotal from breakUpValues
  const getSubtotal = () => {
    const subtotalItem = breakUpValues.display?.find(
      (item) => item.key === "subtotal"
    );
    return subtotalItem?.value.toFixed(2) || 0;
  };

  // Get currency symbol from breakUpValues
  const getCurrencySymbol = () => {
    const subtotalItem = breakUpValues.display?.find(
      (item) => item.key === "subtotal"
    );
    return subtotalItem?.currency_symbol || "RM"; // Default currency symbol
  };

  // Early return if modal should be closed
  if (!isOpen) {
    return <></>;
  }

  // // Item Summary View
  // if (displayType === "summary") {
  //   const totalItems = cartItems.reduce(
  //     (sum, item) => sum + (item.quantity || 1),
  //     0
  //   );
  //   const effectivePrice = "41.80"; // Calculate this from actual data if available
  //   const markedPrice = "55.20"; // Calculate this from actual data if available

  //   return (
  //     <div className={styles.itemSummaryWrapper}>
  //       <div className={styles.leftSection}>
  //         <div className={styles.cartIcon}>
  //           <svg viewBox="0 0 24 24" width="30" height="30" fill="black">
  //             <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
  //           </svg>
  //         </div>
  //         <div className={styles.summaryText}>
  //           <div className={styles.itemCount}>{totalItems} Item</div>
  //           <div className={styles.priceDisplay}>
  //             <span className={styles.currentPrice}>
  //               {getCurrencySymbol()} {effectivePrice}
  //             </span>
  //             <span className={styles.summaryOriginalPrice}>
  //               {getCurrencySymbol()} {markedPrice}
  //             </span>
  //           </div>
  //         </div>
  //       </div>
  //       <button className={styles.addToCartBtn} onClick={onAddToCart}>
  //         Add to Cart
  //       </button>
  //     </div>
  //   );
  // }

  // Empty Cart View
  if (!cartItems?.length) {
    return (
      <div className={styles.cartModalOverlay} id="cart-modal-overlay">
        <div
          className={`${styles.cartModal} ${styles.emptyCart}`}
          ref={modalRef}
          id="empty-cart-modal"
        >
          <div className={styles.closeButton} onClick={onClose}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </div>
          <div className={styles.emptyCartMessage} id="empty-cart-message">
            You have no items in your shopping cart.
          </div>
        </div>
      </div>
    );
  }

  const onCloseModal = () => {
    fpi.custom.setValue("isOpenCartPreview", "false");
  };

  // Regular Cart Modal View with items
  return (
    <div className={styles.cartModalOverlay} id="cart-modal-overlay">
      <div className={styles.connector} id="cart-modal-connector"></div>
      <div className={styles.cartModal} ref={modalRef} id="cart-modal">
        <div
          className={styles.closeButton}
          onClick={() => {
            onClose();
          }}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </div>
        <div className={styles.cartItemContainer} id="cart-items-container">
          {cartItems?.map((item, index) => (
            <div
              key={index}
              className={styles.cartItem}
              id={`cart-item-${index}`}
            >
              <div
                className={styles.imgContainer}
                id={`cart-item-image-${index}`}
              >
                <img
                  src={item.product?.images[0]?.secure_url}
                  alt={item.product?.name}
                  className={styles.itemImage}
                  id={`cart-item-img-${index}`}
                />
              </div>
              <div
                className={styles.itemDetails}
                id={`cart-item-details-${index}`}
              >
                <div
                  className={styles.itemTitle}
                  id={`cart-item-title-${index}`}
                >
                  {item.product?.name}
                </div>
                <div
                  className={styles.itemPrice}
                  id={`cart-item-price-${index}`}
                >
                  <span
                    className={styles.originalPrice}
                    id={`cart-item-original-price-${index}`}
                  >
                    {getProductPrice(item, "marked")}
                  </span>
                  <span
                    className={styles.discountedPrice}
                    id={`cart-item-discounted-price-${index}`}
                  >
                    {getProductPrice(item, "effective")}
                  </span>
                </div>
                <div className={styles.itemMeta} id={`cart-item-meta-${index}`}>
                  <p id={`cart-item-size-${index}`}>
                    <span>Size: </span>
                    {item.article?.size}
                  </p>
                  <p id={`cart-item-quantity-${index}`}>
                    <span>Quantity: </span>
                    {item.quantity}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.cartFooter} id="cart-footer">
          <div className={styles.subtotal} id="cart-subtotal">
            <span className={styles.label} id="cart-subtotal-label">
              <p className={styles.labelText} id="cart-subtotal-text">
                Subtotal:
              </p>{" "}
              <p id="cart-subtotal-amount">
                {getCurrencySymbol()} {getSubtotal()}
              </p>
            </span>
          </div>
          <button
            className={styles.viewBagButton}
            onClick={() => {
              navigate("/cart/bag/");
            }}
            id="cart-view-bag-button"
          >
            VIEW CART
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPreviewModal;
