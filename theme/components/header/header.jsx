import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { FDKLink } from "fdk-core/components";
import { useGlobalStore } from "fdk-core/utils";
import { CART_COUNT } from "../../queries/headerQuery";
import { isRunningOnClient, throttle, isEmptyOrNull } from "../../helper/utils";
import Search from "./search";
import HeaderDesktop from "./desktop-header";
import Navigation from "./navigation";
import I18Dropdown from "./i18n-dropdown";
import useHeader from "./useHeader";
import styles from "./styles/header.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import fallbackLogo from "../../assets/images/logo.png";
import { useAccounts } from "../../helper/hooks";
import useHyperlocal from "./useHyperlocal";
import LocationModal from "@gofynd/theme-template/components/location-modal/location-modal";
import "@gofynd/theme-template/components/location-modal/location-modal.css";

function Header({ fpi }) {
  const CART_ITEMS = useGlobalStore(fpi?.getters?.CART);
  const CONFIGURATION = useGlobalStore(fpi?.getters?.CONFIGURATION);
  const international_shipping =
    CONFIGURATION?.app_features?.common?.international_shipping?.enabled ??
    false;

  const [resetNav, setResetNav] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const {
    globalConfig,
    cartItemCount,
    appInfo,
    HeaderNavigation = [],
    contactInfo,
    wishlistCount,
    loggedIn,
  } = useHeader(fpi);

  const { openLogin } = useAccounts({ fpi });
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const collection = location.pathname.includes("/collection/sample");
  const buyNow = searchParams?.get("buy_now") || false;

  const checkHeaderHeight = throttle(() => {
    if (isRunningOnClient()) {
      setHeaderHeight(headerRef.current.getBoundingClientRect().height);
    }
  }, 1400);

  useEffect(() => {
    if (
      isEmptyOrNull(CART_ITEMS?.cart_items) &&
      location.pathname !== "/cart/bag/"
    ) {
      const payload = {
        includeAllItems: true,
        includeCodCharges: true,
        includeBreakup: true,
        buyNow: buyNow === "true",
      };
      fpi.executeGQL(CART_COUNT, payload);
    }
    if (isRunningOnClient()) {
      setHeaderHeight(headerRef.current.getBoundingClientRect().height);
      window.addEventListener("resize", checkHeaderHeight);
    }
    return () => {
      if (isRunningOnClient()) {
        window.removeEventListener("resize", checkHeaderHeight);
      }
    };
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  useEffect(() => {
    if (isRunningOnClient()) {
      setTimeout(() => {}, 1000);
      const cssVariables = {
        "--headerHeight": `${headerHeight}px`,
      };

      const styleElement = document.createElement("style");
      const variables = JSON.stringify(cssVariables)
        .replaceAll(",", ";")
        .replace(/"/g, "");
      const str = `:root, ::before, ::after${variables}`;
      styleElement.innerHTML = str;

      // Append the <style> element to the document's head
      document.head.appendChild(styleElement);

      // Clean up the <style> element on component unmount
      return () => {
        document.head.removeChild(styleElement);
      };
    }
  }, [headerHeight]);

  const getShopLogoMobile = () =>
    appInfo?.mobile_logo?.secure_url?.replace("original", "resize-h:165") ||
    appInfo?.logo?.secure_url?.replace("original", "resize-h:165") ||
    fallbackLogo;

  const checkLogin = (type) => {
    if (type === "cart") {
      navigate?.("/cart/bag/");
      return;
    }

    if (!loggedIn) {
      openLogin();
      return;
    }

    const routes = {
      profile: "/profile/details",
      profile_mobile: "/profile/profile-tabs",
      wishlist: "/wishlist",
    };

    if (routes[type]) {
      navigate?.(routes[type]);
    }
  };

  const resetSidebarNav = () => {
    setResetNav(true);

    setTimeout(() => {
      setResetNav(false);
    }, 500);
  };

  // to scroll top whenever path changes
  useEffect(() => {
    if (isRunningOnClient()) {
      window?.scrollTo?.(0, 0);
    }
  }, [location?.pathname]);

  const {
    isHyperlocal,
    isLoading,
    pincode,
    deliveryMessage,
    servicibilityError,
    isLocationModalOpen,
    handleLocationModalOpen,
    handleLocationModalClose,
    handleCurrentLocClick,
    handlePincodeSubmit,
  } = useHyperlocal(fpi);

  if (collection) {
    return (
      <div
        className={`${styles.ctHeaderWrapper} fontBody`}
        style={{ borderBottom: "1px solid #7171711c" }}
      >
        <header className={styles.header} ref={headerRef}>
          <div
            className={`${styles.headerContainer} basePageContainer margin0auto`}
          >
            <div
              className={`${styles.mobile} ${styles.flexAlignCenter} ${styles.pizzaHeader}`}
            >
              <div className={`${styles.flexAlignCenter}`}>
                <button
                  className={styles.backButton}
                  onClick={() => navigate(-1)}
                  aria-label="Go back"
                >
                  <svg
                    width="30"
                    height="35"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 6L9 12L15 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <h1 className={styles.pizzaTitle}>Select your Pizza</h1>
              </div>
              <button
                className={styles.searchButton}
                onClick={() => {
                  // Trigger search functionality
                  resetSidebarNav();
                }}
                aria-label="Search"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 21L16.65 16.65"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>
      </div>
    );
  }

  return (
    <>
      <div className={`${styles.ctHeaderWrapper} fontBody`}>
        <header className={styles.header} ref={headerRef}>
          <div
            className={`${styles.headerContainer} basePageContainer margin0auto `}
          >
            {/* <div className={styles.desktop}>
              <HeaderDesktop
                checkLogin={checkLogin}
                fallbackLogo={fallbackLogo}
                cartItemCount={cartItemCount}
                globalConfig={globalConfig}
                LoggedIn={loggedIn}
                appInfo={appInfo}
                navigation={HeaderNavigation}
                wishlistCount={wishlistCount}
                contactInfo={contactInfo}
                fpi={fpi}
                isHyperlocal={isHyperlocal}
                isPromiseLoading={isLoading}
                pincode={pincode}
                deliveryMessage={deliveryMessage}
                onDeliveryClick={handleLocationModalOpen}
              />
            </div> */}
            <div className={styles.mobile}>
              <div
                className={`${styles.mobileTop} ${
                  styles[globalConfig.header_layout]
                } ${styles[globalConfig.logo_menu_alignment]}`}
              >
                {/* <Navigation
                  customClass={`${styles.left} ${styles.flexAlignCenter} ${
                    styles[globalConfig.header_layout]
                  }`}
                  fallbackLogo={fallbackLogo}
                  maxMenuLenght={12}
                  reset
                  isSidebarNav
                  LoggedIn={loggedIn}
                  navigationList={HeaderNavigation}
                  appInfo={appInfo}
                  globalConfig={globalConfig}
                  checkLogin={checkLogin}
                  contactInfo={contactInfo}
                /> */}
                <FDKLink
                  to="/"
                  className={`${styles.middle} ${styles.flexAlignCenter}`}
                >
                  <img
                    className={styles.logo}
                    src={getShopLogoMobile()}
                    alt="name"
                  />
                </FDKLink>
                <div className={`${styles.fontHeader} ${styles.leftPadding}`}>
                  <p className={`${styles.label} ${styles.fontBold}`}>
                    Delivery to
                  </p>
                  <button className={`${styles.flexAlignCenter}`}>
                    <span className={`${styles.descLabel}`}>Bangsar Baru</span>
                    <span
                      className={`${styles.mobileIcon} ${styles.flexAlignCenter}`}
                    >
                      <svg
                        width="20"
                        height="21"
                        viewBox="0 0 20 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15.6242 7.8916L10.0006 13.5152L4.37695 7.8916"
                          stroke="black"
                          stroke-width="1.2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
                <div className={styles.right}>
                  <div
                    className={`${styles.icon} ${styles["right__icons--search"]}`}
                  >
                    <Search
                      onSearchOpened={resetSidebarNav}
                      globalConfig={globalConfig}
                      fpi={fpi}
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      className={`${styles.icon} ${styles["right__icons--bag"]}`}
                      onClick={() => checkLogin("cart")}
                      aria-label="cart"
                    >
                      <SvgWrapper
                        className={`${styles.cart} ${styles.mobileIcon} ${styles.headerIcon}`}
                        svgSrc="single-row-cart"
                      />
                      <span
                        className={styles.cartCount}
                        style={{
                          display: cartItemCount !== 0 ? "initial" : "none",
                        }}
                      >
                        {cartItemCount}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              {isHyperlocal && (
                <button
                  className={styles.mobileBottom}
                  onClick={handleLocationModalOpen}
                >
                  {isLoading ? (
                    "Fetching..."
                  ) : (
                    <>
                      <div className={styles.label}>
                        {pincode ? deliveryMessage : "Enter a pincode"}
                      </div>
                      {pincode && (
                        <div className={styles.pincode}>
                          <span>{pincode}</span>
                          <SvgWrapper
                            className={styles.headerAngleDownIcon}
                            svgSrc="header-angle-down"
                          />
                        </div>
                      )}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
          <div className={`${styles.mobile} ${styles.i18Wrapper}`}>
            {international_shipping && <I18Dropdown fpi={fpi}></I18Dropdown>}
          </div>
        </header>
      </div>
      <LocationModal
        isOpen={isLocationModalOpen}
        pincode={pincode}
        error={servicibilityError}
        onClose={handleLocationModalClose}
        onSubmit={handlePincodeSubmit}
        onCurrentLocationClick={handleCurrentLocClick}
      />
    </>
  );
}

export default Header;
