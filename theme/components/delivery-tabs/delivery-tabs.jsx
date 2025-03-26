import React, { useState } from "react";
import styles from "./delivery-tabs.less";

const DeliveryTabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Delivery", "Takeaway", "Dine-in"];

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div className={styles.deliveryTabs}>
      {tabs.map((tab, index) => (
        <button
          key={tab}
          className={`${styles.deliveryTab} ${index === activeTab ? styles.active : ""}`}
          onClick={() => handleTabClick(index)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default DeliveryTabs;
