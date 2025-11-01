import React from "react";
import { FaPlus, FaChevronRight, FaChevronDown, FaFileAlt } from "react-icons/fa";
import { Collapse } from "react-bootstrap";

function PageNode({ page, onSelect, onCreateChild, level = 0 }) {
  const [open, setOpen] = React.useState(true);

  const handleToggle = (e) => {
    e.stopPropagation();
    setOpen(!open);
  };

  const handleCreateChild = (e) => {
    e.stopPropagation();
    onCreateChild(page._id);
  };

  return (
    <li className="mb-1">
      <div
        className={`d-flex align-items-center justify-content-between ps-${level * 3} py-1 px-2 sidebar-item rounded ${open ? 'open' : ''}`}
        style={{
          cursor: "pointer",
          backgroundColor: "#f8f9fa",
          transition: "all 0.3s ease",
        }}
        onClick={() => onSelect(page)}
      >
        <div className="d-flex align-items-center gap-1 flex-grow-1">
          {page.children && page.children.length > 0 ? (
            <span
              onClick={handleToggle}
              className="text-muted small arrow"
              style={{ transition: "transform 0.3s ease" }}
            >
              {open ? <FaChevronDown /> : <FaChevronRight />}
            </span>
          ) : (
            <span className="text-muted small" style={{ width: "14px" }} />
          )}
          <FaFileAlt className="text-secondary me-1" />
          <span className="text-truncate">{page.title || "Trang mới"}</span>
        </div>

        <button
          className="btn btn-sm btn-light border-0 py-0 px-1"
          onClick={handleCreateChild}
          title="Tạo trang con"
        >
          <FaPlus size={12} />
        </button>
      </div>

      {page.children && page.children.length > 0 && (
        <Collapse in={open}>
          <ul className="list-unstyled ms-3 mt-1">
            {page.children.map((child) => (
              <PageNode
                key={child._id}
                page={child}
                onSelect={onSelect}
                onCreateChild={onCreateChild}
                level={level + 1}
              />
            ))}
          </ul>
        </Collapse>
      )}
    </li>
  );
}

export default function Sidebar({ pages, onSelect, onCreate, onCreateChild }) {
  return (
    <aside
      className="app-sidebar border-end bg-white p-3"
      style={{
        width: "280px",
        overflowY: "auto",
        transition: "all 0.3s ease",
      }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="m-0 fw-bold text-secondary">📘 Ghi chú của tôi</h5>
        <button
          className="btn btn-sm btn-primary shadow-sm"
          onClick={onCreate}
          title="Tạo trang mới"
        >
          <FaPlus />
        </button>
      </div>

      {/* Tree */}
      {pages && pages.length > 0 ? (
        <ul className="list-unstyled page-tree">
          {pages.map((page) => (
            <PageNode
              key={page._id}
              page={page}
              onSelect={onSelect}
              onCreateChild={onCreateChild}
            />
          ))}
        </ul>
      ) : (
        <div className="text-muted small">Chưa có trang nào</div>
      )}
    </aside>
  );
}
