"use client";
import { PdfDocument } from "pdf-tables-parser";
import type React from "react";
import { useState, useRef } from "react";

export default function ImportCoursesFromPDF() {
  const fileInputRef = useRef(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const file = files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target) {
        return;
      }
      const data = e.target.result;
      if (!data) {
        return;
      }
      
      const pdfDoc = new PdfDocument();

      pdfDoc
        .load(Buffer.from(new Uint8Array(data as ArrayBuffer)))
        .then(console.log)
        .catch(console.log);
    };
    reader.readAsArrayBuffer(file);
  };

  return <>
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleFileChange}
      style={{ marginBottom: "10px" }}
    />
  </>;
}
