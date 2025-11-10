"use client";

import React from "react";
import { Form, Offcanvas } from "react-bootstrap";
import { FilledButton } from "@/src/app/components/shared";
import styles from "./CategoryFilter.module.css";

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface CategoryFilterProps {
  title?: string;
  options?: FilterOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  showMobile?: boolean;
  onMobileClose?: () => void;
  variant?: "radio" | "checkbox";
  onApply?: () => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  title = "Filter Kategori",
  options = [], // Default empty array
  selectedValue,
  onChange,
  showMobile = false,
  onMobileClose,
  variant = "radio",
  onApply,
}) => {
  // Guard clause - return null jika options kosong
  if (!options || options.length === 0) {
    console.warn("CategoryFilter: No options provided");
    return null;
  }

  // Validate selectedValue
  const safeSelectedValue = selectedValue || options[0]?.value || "";

  const FilterContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <Form className={styles.filterForm}>
      {options.map((option, index) => {
        // Safety check untuk setiap option
        if (!option || !option.value) {
          console.warn(`CategoryFilter: Invalid option at index ${index}`);
          return null;
        }

        return (
          <div key={`${option.value}-${index}`} className={styles.filterItem}>
            <Form.Check
              type={variant}
              id={`${isMobile ? "mobile-" : ""}filter-${index}`}
              name={isMobile ? "mobile-filter-group" : "filter-group"}
              label={
                <span className={styles.filterLabel}>
                  {option.label}
                  {option.count !== undefined && (
                    <span className={styles.filterCount}>({option.count})</span>
                  )}
                </span>
              }
              checked={
                variant === "radio"
                  ? safeSelectedValue === option.value
                  : safeSelectedValue.includes(option.value)
              }
              onChange={() => onChange(option.value)}
            />
          </div>
        );
      })}
      {isMobile && onApply && (
        <div className={styles.applyButtonWrapper}>
          <FilledButton
            label="Terapkan"
            type="button"
            className="w-100"
            onClick={onApply}
          />
        </div>
      )}
    </Form>
  );

  return (
    <>
      {/* Desktop Filter */}
      <div className={`${styles.desktopFilter} d-none d-md-block`}>
        <h5 className={styles.filterTitle}>{title}</h5>
        <FilterContent />
      </div>

      {/* Mobile Offcanvas Filter */}
      <Offcanvas
        show={showMobile}
        onHide={onMobileClose}
        placement="start"
        className={styles.mobileFilter}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{title}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <FilterContent isMobile />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default CategoryFilter;
