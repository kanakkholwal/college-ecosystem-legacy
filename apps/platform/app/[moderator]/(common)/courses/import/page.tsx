"use client";
import { PdfDocument } from "@pomgui/pdf-tables-parser";
import React, { useState, useRef } from "react";

export default function ImportCoursesFromPDF() {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if(e.target){
        return
      }
      const data = e.target.result;

      const pdfDoc = new PdfDocument();

      pdfDoc
        .load(data)
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
