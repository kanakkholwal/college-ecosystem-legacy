"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/typography";
import { toPng } from "html-to-image";
import { ArrowRight } from 'lucide-react';
import Link from "next/link";
import { useRef } from "react";
import Barcode from 'barcode-react';
import { HiOutlineDownload } from "react-icons/hi";
import type { OutPassType } from "~/models/hostel_n_outpass";
import { COLLEGE_NAME } from "~/project.config";

interface OutpassRenderProps {
  outpass: OutPassType;
  viewOnly?: boolean;
}

const classNames = {
  root: "h-[700px] w-[720px] aspect-square mx-auto rounded-lg bg-white p-5 border border-gray-200 shadow-md",
  rootSmall: "w-full h-auto aspect-square mx-auto rounded-lg bg-white p-3 border border-gray-200 shadow-md group special:bg-white",
  header: "text-center mb-4",
  header_clg_title: "text-xl font-semibold text-gray-600 group-[.special]:text-lg",
  header_hostel_title: "text-2xl font-bold text-gray-800 group-[.special]:text-base",
  meta_container: "mt-4 flex justify-between items-center text-sm",
  meta_item: "flex flex-col text-gray-700",
  meta_label: "font-bold",
  meta_value: "font-medium text-right",
  main: "mt-6 space-y-4 text-sm text-gray-700 group-[.special]:text-xs",
  field: "flex justify-between group-[.special]:flex-wrap",
  label: "font-semibold",
  value: "text-right",
  note: "mt-6 text-sm text-gray-600 italic group-[.special]:text-xs",
  footer: "flex justify-between",
  qr_code: "mt-6 flex-0",
  signature: "mt-6 text-sm text-gray-800 font-bold text-right group-[.special]:text-xs",
  signature_value: "mt-3 text-sm text-gray-700 font-bold italic text-right group-[.special]:text-xs",
};

export default function OutpassRender({ outpass,viewOnly=false }: OutpassRenderProps) {
  const outpassRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (outpassRef.current) {
      try {
        const dataUrl = await toPng(outpassRef.current, {
          cacheBust: true,
          height: 691,
          width: 720,
          canvasHeight: 691,
          canvasWidth: 720,
        });

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
      } catch (e) {
        console.error(e);

      }
    }
  };


  return (
    <>

      {!viewOnly && (<div className="flex justify-between items-center w-full gap-2 flex-wrap">
        <Heading level={5}>Requested OutPass</Heading>
        <div className="flex gap-2 justify-end items-center flex-wrap">
          <Button type="button" variant="default_light" effect="shineHover" size="sm" onClick={handleDownload}>
            Download <HiOutlineDownload />
          </Button>
          <Button variant="link" effect="hoverUnderline" size="sm" asChild>
            <Link href="request">Request Outpass<ArrowRight /></Link>
          </Button>
        </div>
      </div>)}
      <div className="w-full overflow-auto h-full relative">
        <div className="fixed left-[-1200%] @2xl:relative @2xl:left-0">
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
                <Barcode value={outpass._id} height={100} width={2} format="pharmacode" displayValue={false} />
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
        </div>
        {/* For smaller screens */}
        <div className="@2xl:hidden">
          <div className={classNames.rootSmall}>
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
                <span className={classNames.value}>{outpass.student.rollNumber}</span>
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
                correct. I am responsible for adhering to the rules and regulations of
                the hostel. In case of any misconduct, I will be held accountable for
                disciplinary actions as per institute rules.
              </p>
              <p className="mt-4">
                For Office Use Only: This outpass is valid until{" "}
                <strong>{new Date(outpass.validTill).toLocaleString("en-US")}</strong>
              </p>
            </section>
            <footer className={classNames.footer}>
              <div className={classNames.qr_code}>
                <Barcode
                  value={outpass._id}
                  height={100}
                  width={2}
                  format="pharmacode"
                  displayValue={false}
                />
              </div>
              <div className={classNames.signature}>
                <p className={classNames.signature}>Signature of Student</p>
                <p className={classNames.signature_value}>{outpass.student.name}</p>
              </div>
              <div className={classNames.signature}>
                <p className={classNames.signature}>Signature of Warden / In Charge:</p>
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
        </div>

      </div>
    </>
  );
}
