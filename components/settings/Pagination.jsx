"use client";
import React from "react";
import ReactPaginate from "react-paginate";
import useTranslate from "@/Contexts/useTranslation";

const Pagination = ({
  pageCount = 10,
  screenSize,
  onPageChange,
  isDashBoard = false,
}) => {
  const t = useTranslate();

  return (
    <ReactPaginate
      pageCount={pageCount}
      marginPagesDisplayed={isDashBoard ? 2 : 1}
      pageRangeDisplayed={screenSize === "small" ? 1 : 2}
      breakLabel="..."
      nextLabel={`${screenSize !== "small" ? t.actions.next : ""} >`}
      previousLabel={`< ${screenSize !== "small" ? t.actions.prev : ""}`}
      pageLinkClassName="page-num"
      previousLinkClassName="page-num btns"
      nextLinkClassName="page-num btns"
      containerClassName="pagination"
      activeClassName="active"
      forcePage={0}
      onPageChange={onPageChange}
      renderOnZeroPageCount={null}
    />
  );
};

export default Pagination;
