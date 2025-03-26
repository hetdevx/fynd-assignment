import styles from "./mobile-header.less";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import React, { useState } from "react";
import StickyColumn from "../../page-layouts/plp/Components/sticky-column/sticky-column";
import FilterTags from "../../page-layouts/plp/Components/filter-tags/filter-tags";
import FilterItem from "../../page-layouts/plp/Components/filter-item/filter-item";

const MobileHeader = ({
  filterList,
  onFilterModalBtnClick,
  // isResetFilterDisable,
  // selectedFilters,
  // onFilterUpdate,
  // onResetFiltersClick,
  // onSortModalBtnClick,
  // columnCount,
  // onColumnCountUpdate,
}) => {
  const [vegSelected, setVegSelected] = useState(false);
  const [nonVegSelected, setNonVegSelected] = useState(false);

  return (
    <div className={styles.mobileHeader}>
      {/* First div with Veg/Non-Veg buttons */}
      <div className={styles.dietButtons}>
        <button
          className={`${styles.filterButton} ${styles.veg} ${vegSelected ? styles.selected : ""}`}
          onClick={() => setVegSelected(!vegSelected)}
        >
          <div
            className={`${styles.indicator} ${vegSelected ? styles.selected : ""}`}
          >
            <div className={styles.dot}></div>
          </div>
          <span>Veg</span>
        </button>

        <button
          className={`${styles.filterButton} ${styles.nonVeg} ${nonVegSelected ? styles.selected : ""}`}
          onClick={() => setNonVegSelected(!nonVegSelected)}
        >
          <div
            className={`${styles.indicator} ${nonVegSelected ? styles.selected : ""}`}
          >
            <div className={styles.dot}></div>
          </div>
          <span>Non Veg</span>
        </button>
      </div>

      {/* Second div with Filter button */}
      <div className={styles.filterButtonContainer}>
        {filterList.length > 0 && (
          <button className={styles.filterBtn} onClick={onFilterModalBtnClick}>
            <SvgWrapper svgSrc="filter" />
            <span>Filters</span>
          </button>
        )}
      </div>
      {filterList?.length !== 0 && (
        <div className={styles?.left}>
          <StickyColumn>
            <div className={styles.filterHeaderContainer}>
              <div className={styles.filterHeader}>
                <h4 className={styles.title}>FILTERS</h4>
                {!isResetFilterDisable && (
                  <button
                    className={styles.resetBtn}
                    onClick={onResetFiltersClick}
                  >
                    RESET
                  </button>
                )}
              </div>

              <FilterTags
                selectedFilters={selectedFilters}
                onFilterUpdate={onFilterUpdate}
              />
            </div>
            {filterList?.map((filter, idx) => (
              <FilterItem
                isMobileView={false}
                key={idx + "-desktop" + filter.key.display}
                filter={filter}
                onFilterUpdate={onFilterUpdate}
              />
            ))}
          </StickyColumn>
        </div>
      )}

      {/* Commented code preserved as requested */}
      {/* <div className={styles.headerRight}>
        <button
          className={`${styles.colIconBtn} ${styles.mobile} ${
            columnCount?.mobile === 1 ? styles.active : ""
          }`}
          onClick={() =>
            onColumnCountUpdate({ screen: "mobile", count: 1 })
          }
          title="Mobile grid one"
        >
          <SvgWrapper svgSrc="grid-one-mob" />
        </button>
        <button
          className={`${styles.colIconBtn} ${styles.mobile} ${
            columnCount?.mobile === 2 ? styles.active : ""
          }`}
          onClick={() =>
            onColumnCountUpdate({ screen: "mobile", count: 2 })
          }
          title="Mobile grid two"
        >
          <SvgWrapper svgSrc="grid-two-mob" />
        </button>
        <button
          className={`${styles.colIconBtn} ${styles.tablet} ${
            columnCount?.tablet === 2 ? styles.active : ""
          }`}
          onClick={() =>
            onColumnCountUpdate({ screen: "tablet", count: 2 })
          }
          title="Tablet grid two"
        >
          <SvgWrapper svgSrc="grid-two" />
        </button>
        <button
          className={`${styles.colIconBtn} ${styles.tablet} ${
            columnCount?.tablet === 3 ? styles.active : ""
          }`}
          onClick={() =>
            onColumnCountUpdate({ screen: "tablet", count: 3 })
          }
          title="Tablet grid four"
        >
          <SvgWrapper svgSrc="grid-four" />
        </button>
      </div>{" "} */}
    </div>
  );
};

export default MobileHeader;
