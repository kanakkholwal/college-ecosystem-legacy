"use client";
import { PdfDocument } from "pdf-tables-parser";
import type React from "react";
import { useState, useRef } from "react";

export default function ImportCoursesFromPDF() {
  const fileInputRef = useRef(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const file = files[0];
    console.log(files);
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      console.log(e.target);
      if (!e.target) {
        return;
      }
      const data = e.target.result;
      console.log(data);

      if (!data) {
        return;
      }

      const pdfDoc = new PdfDocument();
      console.log(pdfDoc);

      await pdfDoc.load(data as string);
      console.log(pdfDoc);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ marginBottom: "10px" }}
      />
    </>
  );
}
