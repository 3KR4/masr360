"use client";
import React from "react";
import ReactPaginate from "react-paginate";

const Pagination = ({ pageCount = 10, onPageChange }) => {
  return (
    <ReactPaginate
      pageCount={pageCount}
      marginPagesDisplayed={1}
      pageRangeDisplayed={2}
      breakLabel="..."
      nextLabel="next >"
      previousLabel="< prev"
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