// app/sections/user/catalog/SearchBar.tsx
"use client";

import React from "react";
import { Form } from "react-bootstrap";
import { FiSearch, FiFilter } from "react-icons/fi";
import styles from "./Searchbar.module.css";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFilterClick?: () => void;
  showFilterButton?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Cari barang",
  onFilterClick,
  showFilterButton = true,
}) => {
  return (
    <div className={styles.searchBarContainer}>
      <div className={styles.searchWrapper}>
        <FiSearch size={18} className={styles.searchIcon} />
        <Form.Control
          type="text"
          placeholder={placeholder}
          className={styles.searchInput}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {showFilterButton && (
        <button
          className={`${styles.filterButton} d-md-none`}
          onClick={onFilterClick}
          aria-label="Open filter">
          <FiFilter size={22} color="#333" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
