import React from "react";
import styles from "./bottom-navbar.less";

const BottomNavigation = () => {
  const showLogo = window.location.pathname === "/";

  if (!showLogo) {
    return null;
  }

  return (
    <div className={styles.bottomNavigation}>
      <div className={`${styles.navItem} ${styles.active}`}>
        <div className={`${styles.homeIcon} ${styles.icon}`}></div>
        <span className={styles.label}>Home</span>
      </div>
      <div className={styles.navItem}>
        <div className={`${styles.icon} ${styles.menuIcon}`}></div>
        <span className={styles.label}>Menu</span>
      </div>
      <div className={styles.navItem}>
        <div className={`${styles.icon} ${styles.rewardIcon}`}></div>
        <span className={styles.label}>Hut Reward</span>
      </div>
      <div className={styles.navItem}>
        <div className={`${styles.icon} ${styles.profileIcon}`}></div>
        <span className={styles.label}>Profile</span>
      </div>
    </div>
  );
};

export default BottomNavigation;
