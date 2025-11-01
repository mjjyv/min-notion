import React, { useState } from "react";
import { FaChevronRight, FaChevronDown, FaFileAlt, FaPlus } from "react-icons/fa";

function TreeNode({ page, onSelect, onCreateChild }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="tree-node ms-2">
      <div
        className="d-flex align-items-center py-1"
        style={{ cursor: "pointer" }}
        onClick={() => onSelect(page)}
      >
        {page.children?.length > 0 && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
            className="me-1 text-secondary"
          >
            {open ? <FaChevronDown /> : <FaChevronRight />}
          </span>
        )}
        <FaFileAlt className="me-2 text-muted" />
        <span>{page.title || "Trang mới"}</span>
        <FaPlus
          className="ms-auto text-muted small"
          onClick={(e) => {
            e.stopPropagation();
            onCreateChild(page._id);
          }}
        />
      </div>
      {open && page.children?.length > 0 && (
        <div className="ms-3">
          {page.children.map((child) => (
            <TreeNode
              key={child._id}
              page={child}
              onSelect={onSelect}
              onCreateChild={onCreateChild}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PageTree({ pages, onSelect, onCreateChild }) {
  return (
    <div className="page-tree">
      {pages.map((page) => (
        <TreeNode
          key={page._id}
          page={page}
          onSelect={onSelect}
          onCreateChild={onCreateChild}
        />
      ))}
    </div>
  );
}
