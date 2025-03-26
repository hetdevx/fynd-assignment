import React, { useEffect, useState } from "react";
import styles from "./add-to-cart.less";
import ImageGallery from "../image-gallery/image-gallery";
import ProductVariants from "../product-variants/product-variants";
import OutsideClickHandler from "react-outside-click-handler";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import FyButton from "../../../../components/core/fy-button/fy-button";
import DeliveryInfo from "../delivery-info/delivery-info";
import Loader from "../../../../components/loader/loader";
import CartPreviewModal from "../../../../components/cart-preview-modal/cart-preview-modal";
import useCart from "../../../cart/useCart";
import { useFPI, useGlobalStore } from "fdk-core/utils";

const AddToCart = ({
  isLoading = false,
  productData = {},
  globalConfig = {},
  pdpPageConfig = {},
  slug = "",
  selectedSize = "",
  showSizeDropdown = false,
  deliverInfoProps = {},
  sizeError = false,
  handleSlugChange = (updatedSlug) => {},
  onSizeSelection = () => {},
  handleShowSizeGuide = () => {},
  setShowSizeDropdown = () => {},
  addProductForCheckout = () => {},
  handleViewMore = () => {},
  handleClose = () => {},
}) => {
  const fpi = useFPI();
  const { product = {}, productPrice = {} } = productData;

  const [showCartPreview, setShowCartPreview] = useState(false);

  const { button_options, disable_cart, show_price } = globalConfig;

  const { media, name, short_description, variants, sizes, uid, moq, brand } =
    product;

  const isMto = product?.custom_order?.is_custom_order || false;
  const {
    seller,
    price_per_piece,
    delivery_promise,
    store,
    article_id,
    article_assignment,
  } = productPrice;

  const isSizeSelectionBlock = pdpPageConfig?.size_selection_style === "block";
  const isSingleSize = sizes?.sizes?.length === 1;
  const isSizeCollapsed = pdpPageConfig?.hide_single_size && isSingleSize;

  const CustomValue = useGlobalStore(fpi.getters.CUSTOM_VALUE);
  // const preSelectFirstOfMany = pdpPageConfig?.preselect_size;
  const preSelectFirstOfMany = true;

  let value = false;

  // console.log("valueeeeee", value);

  const images = [
    {
      alt: "image",
      type: "image",
      url: "https://hdn-1.fynd.com/company/884/applications/000000000000000000000001/theme/pictures/free/original/theme-image-1623307821127.png",
    },
  ];

  const getProductPrice = (key) => {
    return `${price_per_piece?.currency_symbol || ""} ${price_per_piece?.[key] || ""}`;
  };

  const isSizeGuideAvailable = () => {
    const sizeChartHeader = sizes?.size_chart?.headers || {};
    return Object.keys(sizeChartHeader).length > 0 || sizes?.size_chart?.image;
  };

  useEffect(() => {
    if (isSizeCollapsed || (preSelectFirstOfMany && sizes !== undefined)) {
      onSizeSelection(sizes?.sizes?.[0].value);
    }
  }, [isSizeCollapsed, preSelectFirstOfMany, sizes?.sizes]);

  const isOpen = CustomValue.isOpenCartPreview;

  const { cartItemsWithActualIndex, breakUpValues, onGotoCheckout } =
    useCart(fpi);

  useEffect(() => {
    fpi.custom.setValue("isOpenCartPreview", false);
  }, []);

  // Simplified add to cart function with clear steps
  const handleAddToCart = async (event) => {
    // console.log("djffjskkskk");
    // First, add the product to cart
    await addProductForCheckout(event, selectedSize, false);

    fpi.custom.setValue("isOpenCartPreview", !isOpen);

    // handleClose();
  };

  // console.log(
  //   CustomValue.test1,
  //   "showCartPreviewshowCartPreview",
  //   showCartPreview
  // );

  const onClose = () => {
    isOpen = !isOpen;
    fpi.custom.setValue("isOpenCartPreview", false);
    console.log(isOpen, "asdsmfkdgfmsdkf");
  };

  console.log(isOpen, "aksndsfdgkjasdjkfgkfdnsjdkf");

  return (
    <>
      <div className={styles.productDescContainer}>
        {isLoading ? (
          <div className={styles.loader}>
            <Loader
              containerClassName={styles.loaderContainer}
              loaderClassName={styles.customLoader}
            />
          </div>
        ) : (
          <>
            <div className={styles.left}>
              <div className={styles.imgWrap}>
                <ImageGallery
                  key={slug}
                  images={slug && media?.length ? media : images}
                  product={product}
                  globalConfig={globalConfig}
                  hiddenDots={true}
                  slideTabCentreNone={true}
                  hideImagePreview={true}
                />
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.productInfo}>
                <div className={styles.product}>
                  <div className={styles.crossIcon} onClick={handleClose}>
                    <SvgWrapper svgSrc="cross-black" />
                  </div>

                  {/* ---------- Product Name ----------  */}
                  <h1 className={styles.product__title}>{slug && name}</h1>
                  <div className={styles.product__brand}>{brand?.name}</div>
                  {/* ---------- Product Price ---------- */}

                  <div className={styles.productPriceContainer}>
                    {show_price && sizes?.sellable && (
                      <div className={styles.product__price}>
                        <div className={styles.priceWrapper}>
                          <h4 className={styles["product__price--effective"]}>
                            {getProductPrice("effective")}
                          </h4>
                          {getProductPrice("effective") !==
                            getProductPrice("marked") && (
                            <span className={styles["product__price--marked"]}>
                              {getProductPrice("marked")}
                            </span>
                          )}
                        </div>
                        {sizes?.discount && (
                          <span className={styles["product__price--discount"]}>
                            {sizes?.discount}
                          </span>
                        )}
                      </div>
                    )}
                    {pdpPageConfig?.tax_label && (
                      <div className={styles.taxLabel}>
                        ({pdpPageConfig?.tax_label})
                      </div>
                    )}
                  </div>

                  {/* ---------- Product Tax Label ---------- */}
                  {pdpPageConfig?.tax_label && (
                    <div className={styles.taxLabel}>
                      ({pdpPageConfig?.tax_label})
                    </div>
                  )}

                  {/* ---------- Short Description ----------  */}
                  {short_description?.length > 0 && (
                    <p
                      className={`${styles.b2} ${styles.fontBody} ${styles.shortDescription}`}
                    >
                      {slug && short_description}
                    </p>
                  )}
                  {/* ---------- Product Variants ----------  */}
                  {slug && variants?.length > 0 && (
                    <ProductVariants
                      product={product}
                      variants={variants}
                      currentSlug={slug}
                      globalConfig={globalConfig}
                      preventRedirect
                      setSlug={handleSlugChange}
                    />
                  )}
                  {/* ---------- Size Container ---------- */}
                  {isSizeSelectionBlock && !isSizeCollapsed && (
                    <div className={styles.sizeSelection}>
                      <div className={styles.sizeHeaderContainer}>
                        <p
                          className={`${styles.b2} ${styles.sizeSelection__label}`}
                        >
                          <span>
                            Style:{" "}
                            {Boolean(selectedSize) && `Size (${selectedSize})`}
                          </span>
                        </p>
                        {pdpPageConfig?.show_size_guide &&
                          isSizeGuideAvailable() &&
                          sizes?.sellable && (
                            <FyButton
                              variant="text"
                              onClick={handleShowSizeGuide}
                              className={styles["product__size--guide"]}
                              endIcon={
                                <SvgWrapper
                                  svgSrc="scale"
                                  className={styles.scaleIcon}
                                />
                              }
                            >
                              SIZE GUIDE
                            </FyButton>
                          )}
                      </div>

                      <div className={styles.sizeSelection__wrapper}>
                        {sizes?.sizes?.map((size) => (
                          <button
                            type="button"
                            key={`${size?.display}`}
                            className={`${styles.b2} ${styles.sizeSelection__block} ${
                              size.quantity === 0 &&
                              !isMto &&
                              styles["sizeSelection__block--disable"]
                            } ${
                              (size?.quantity !== 0 || isMto) &&
                              styles["sizeSelection__block--selectable"]
                            } ${
                              selectedSize === size?.value &&
                              styles["sizeSelection__block--selected"]
                            } `}
                            title={size?.value}
                            onClick={() => onSizeSelection(size)}
                          >
                            {size?.display}
                            {size?.quantity === 0 && !isMto && (
                              <svg>
                                <line x1="0" y1="100%" x2="100%" y2="0" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* ---------- Size Dropdown And Action Buttons ---------- */}
                  {!isSizeSelectionBlock && !isSizeCollapsed && (
                    <div className={styles.sizeCartContainer}>
                      <div className={styles.sizeDropdownWrapper}>
                        <div
                          className={`${styles.sizeDropdownButton} ${!sizes?.sizes?.length && styles.disabledButton}`}
                          onClick={() => {
                            if (sizes?.sizes?.length) {
                              setShowSizeDropdown(true);
                            }
                          }}
                        >
                          <p className={styles.dropdownLabel}>
                            {selectedSize
                              ? `Size: ${selectedSize}`
                              : "SELECT SIZE"}
                          </p>
                          <div className={styles.arrowIconWrapper}>
                            <SvgWrapper
                              svgSrc="arrow-down"
                              className={`${styles.dropdownArrow} ${
                                showSizeDropdown && styles.rotateArrow
                              }`}
                            />
                          </div>
                        </div>
                        <OutsideClickHandler
                          onOutsideClick={() => {
                            setShowSizeDropdown(false);
                          }}
                        >
                          {showSizeDropdown && (
                            <ul className={styles.sizeDropdownList}>
                              {sizes?.sizes?.map((size) => (
                                <li
                                  onClick={() => {
                                    onSizeSelection(size);
                                    setShowSizeDropdown(false);
                                  }}
                                  key={size?.value}
                                  className={`${styles.sizeOption} ${
                                    selectedSize === size.value &&
                                    styles.sizeOptionSelected
                                  } ${
                                    size.quantity === 0 && !isMto
                                      ? styles.sizeOptionDisabled
                                      : styles.sizeOptionSelectable
                                  }`}
                                >
                                  <span>{size.display}</span>
                                  {size.quantity === 0 && !isMto && (
                                    <span className={styles.outOfStock}>
                                      Out of Stock
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </OutsideClickHandler>
                      </div>
                      {pdpPageConfig?.show_size_guide &&
                        isSizeGuideAvailable() &&
                        sizes?.sellable && (
                          <FyButton
                            variant="text"
                            onClick={handleShowSizeGuide}
                            className={styles.sizeGuideButton}
                          >
                            <span>SIZE GUIDE</span>
                            <SvgWrapper
                              svgSrc="scale"
                              className={styles.scaleIcon}
                            />
                          </FyButton>
                        )}
                    </div>
                  )}

                  {sizeError && (
                    <div className={styles.sizeError}>
                      Please select size to continue
                    </div>
                  )}
                  {/* {sizes?.sellable && selectedSize && (
                  <DeliveryInfo {...deliverInfoProps} />
                )} */}

                  {/* <div className={styles.viewMore}>
                  <span onClick={handleViewMore}>View Full details</span>
                </div> */}
                </div>
                {/* ---------- Buy Now and Add To Cart ---------- */}
                <div className={styles.actionButtons}>
                  {!disable_cart && sizes?.sellable && (
                    <>
                      {/* {button_options?.includes("buynow") && (
                      <FyButton
                        className={styles.buyNow}
                        color="secondary"
                        size="medium"
                        onClick={(event) =>
                          addProductForCheckout(event, selectedSize, true)
                        }
                      >
                        BUY NOW
                      </FyButton>
                    )} */}
                      {button_options?.includes("addtocart") && (
                        <FyButton
                          variant="contained"
                          size="medium"
                          onClick={(event) => handleAddToCart(event)}
                          className={styles.addToCartBtn}
                        >
                          ADD TO CART
                        </FyButton>
                      )}
                    </>
                  )}
                  {!sizes?.sellable && (
                    <FyButton variant="outlined" disabled size="medium">
                      PRODUCT NOT AVAILABLE
                    </FyButton>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <CartPreviewModal
        cartItems={cartItemsWithActualIndex || []}
        breakUpValues={breakUpValues || {}}
        isOpen={isOpen}
        onClose={handleClose}
      />
    </>
  );
};

export default AddToCart;
