"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toPng } from "html-to-image";
import { QRCodeCanvas } from "qrcode.react";
import { useRef } from "react";
import type { OutPassType } from "~/models/hostel_n_outpass";
import { COLLEGE_NAME } from "~/project.config";

interface OutpassRenderProps {
  outpass: OutPassType;
}

const classNames = {
  root: "w-full max-w-[720px] mx-auto rounded-lg bg-white p-5 border border-gray-200 shadow-md",
  header: "text-center mb-4",
  header_clg_title: "text-xl font-semibold text-gray-600",
  header_hostel_title: "text-2xl font-bold text-gray-800",
  meta_container: "mt-4 flex justify-between items-center text-sm",
  meta_item: "flex flex-col text-gray-700",
  meta_label: "font-bold",
  meta_value: "font-medium text-right",
  main: "mt-6 space-y-4 text-sm text-gray-700",
  field: "flex justify-between",
  label: "font-semibold",
  value: "text-right",
  note: "mt-6 text-sm text-gray-600 italic",
  footer: "flex justify-between",
  qr_code: "mt-6 flex justify-center",
  signature: "mt-6 text-sm text-gray-800 font-bold text-right",
  signature_value: "mt-3 text-sm text-gray-700 font-bold italic text-right",
};

export default function OutpassRender({ outpass }: OutpassRenderProps) {
  const outpassRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (outpassRef.current) {
      const dataUrl = await toPng(outpassRef.current, { cacheBust: true });

      const downloadImage = () => {
        const link = document.createElement("a"); // Create an anchor element
        link.href = dataUrl; // Set the href to the image URL
        link.style.visibility = "hidden"; // Set the visibility to hidden
        link.download = `Outpass_${outpass.student.rollNumber}.png`; // Set the download attribute with the desired file name
        document.body.appendChild(link); // Append the link to the document
        link.click(); // Programmatically click the link to trigger the download
        document.body.removeChild(link); // Clean up by removing the link from the document
      };
      if (dataUrl) {
        downloadImage();
      }
    }
    const qrData = JSON.stringify({
      id: outpass._id,
      expiry: outpass.validTill,
      status: outpass.status,
    });
  };
  const qrData = JSON.stringify({
    id: outpass._id,
    expiry: outpass.validTill,
    status: outpass.status,
  });
  return (
    <>
      <div>
        <Button type="button" onClick={handleDownload}>
          Download
        </Button>
      </div>

      <div ref={outpassRef} className={classNames.root}>
        <header className={classNames.header}>
          <h1 className={classNames.header_clg_title}>{COLLEGE_NAME}</h1>
          <h2 className={classNames.header_hostel_title}>
            Office of {outpass.hostel.name}
          </h2>
        </header>

        <div className={classNames.meta_container}>
          <div className={classNames.meta_item}>
            <span className={classNames.meta_label}>Date</span>
            <span className={classNames.meta_value}>
              {new Date(outpass.createdAt || "").toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <div className={classNames.meta_item}>
            <span className={classNames.meta_label}>Digital Outpass</span>
            <span className={classNames.meta_value}>
              <Badge
                size="sm"
                variant={
                  outpass.status === "approved"
                    ? "success_light"
                    : outpass.status === "pending"
                      ? "warning_light"
                      : "destructive_light"
                }
              >
                {outpass.status}
              </Badge>
            </span>
          </div>
        </div>

        <main className={classNames.main}>
          <div className={classNames.field}>
            <span className={classNames.label}>Name:</span>
            <span className={classNames.value}>{outpass.student.name}</span>
          </div>
          <div className={classNames.field}>
            <span className={classNames.label}>Roll No.:</span>
            <span className={classNames.value}>
              {outpass.student.rollNumber}
            </span>
          </div>
          <div className={classNames.field}>
            <span className={classNames.label}>Hostel Room No.:</span>
            <span className={classNames.value}>{outpass.roomNumber}</span>
          </div>
          <div className={classNames.field}>
            <span className={classNames.label}>Reason:</span>
            <span className={classNames.value}>{outpass.reason}</span>
          </div>
          <div className={classNames.field}>
            <span className={classNames.label}>Expected Out Time:</span>
            <span className={classNames.value}>
              {new Date(outpass.expectedOutTime).toLocaleString("en-US")}
            </span>
          </div>
          <div className={classNames.field}>
            <span className={classNames.label}>Expected In Time:</span>
            <span className={classNames.value}>
              {new Date(outpass.expectedInTime).toLocaleString("en-US")}
            </span>
          </div>
          <div className={classNames.field}>
            <span className={classNames.label}>Address:</span>
            <span className={classNames.value}>{outpass.address}</span>
          </div>
        </main>

        <section className={classNames.note}>
          <p>
            Undertaking: I hereby confirm that the information provided above is
            correct. I am responsible for adhering to the rules and regulations
            of the hostel. In case of any misconduct, I will be held accountable
            for disciplinary actions as per institute rules.
          </p>
          <p className="mt-4">
            For Office Use Only: This outpass is valid until{" "}
            <strong>
              {new Date(outpass.validTill).toLocaleString("en-US")}
            </strong>
          </p>
        </section>
        <footer className={classNames.footer}>
          <div className={classNames.qr_code}>
            <QRCodeCanvas value={qrData} size={128} />
          </div>
          <div className={classNames.signature}>
            <p className={classNames.signature}>Signature of Student</p>
            <p className={classNames.signature_value}>{outpass.student.name}</p>
          </div>
          <div className={classNames.signature}>
            <p className={classNames.signature}>
              Signature of Warden / In Charge:
            </p>
            <p className={classNames.signature_value}>
              <Badge
                size="sm"
                variant={
                  outpass.status === "approved"
                    ? "success_light"
                    : outpass.status === "pending"
                      ? "warning_light"
                      : "destructive_light"
                }
              >
                {outpass.status}
              </Badge>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
