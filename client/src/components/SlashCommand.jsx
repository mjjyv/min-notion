import React from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

export default function SlashCommand({ onCommand }) {
  const commands = [
    { key: "heading", label: "Tiêu đề lớn" },
    { key: "todo", label: "Checklist" },
    { key: "divider", label: "Đường kẻ" },
  ];

  return (
    <Tippy
      content={
        <div className="p-2 bg-white shadow rounded small">
          {commands.map((cmd) => (
            <div
              key={cmd.key}
              className="command-item py-1 px-2"
              style={{ cursor: "pointer" }}
              onClick={() => onCommand(cmd.key)}
            >
              {cmd.label}
            </div>
          ))}
        </div>
      }
      interactive
      trigger="click"
    >
      <span className="text-primary" style={{ cursor: "pointer" }}>
        /
      </span>
    </Tippy>
  );
}
