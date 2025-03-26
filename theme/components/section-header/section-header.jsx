import React from "react";
import styles from "./section-header.less";
import { useNavigate } from "react-router-dom";

const SectionHeader = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.sectionHeader}>
      <h2 className={styles.title}>{title}</h2>
      <button
        className={styles.viewAll}
        onClick={() => navigate("/collection/sample")}
      >
        View all
      </button>
    </div>
  );
};

export default SectionHeader;
