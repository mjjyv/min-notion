import React, { useState } from "react";
import SlashCommand from "./SlashCommand";

export default function RichTextEditor({ value, onChange }) {
  const [content, setContent] = useState(value || "");

  const handleChange = (e) => {
    setContent(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="rich-editor">
      <div className="d-flex align-items-center mb-2">
        <SlashCommand onCommand={(key) => console.log("Command:", key)} />
      </div>
      <textarea
        className="form-control"
        style={{ minHeight: "300px", fontFamily: "inherit", fontSize: "1rem" }}
        value={content}
        onChange={handleChange}
        placeholder="Nhập nội dung ở đây..."
      />
    </div>
  );
}
