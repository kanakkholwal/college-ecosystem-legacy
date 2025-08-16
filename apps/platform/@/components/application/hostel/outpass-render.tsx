"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/typography";
import { ButtonLink } from "@/components/utils/link";
import { cn } from "@/lib/utils";
import BarCode from "barcode-react";
import { format } from "date-fns";
import { toPng } from "html-to-image";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineDownload } from "react-icons/hi";
import type { OutPassType } from "~/models/hostel_n_outpass";
import { orgConfig } from "~/project.config";

interface OutpassRenderProps {
  outpass: OutPassType;
  viewOnly?: boolean;
}

const classNames = {
  rootContainer:
    "relative w-full max-w-[720px] mx-auto flex items-center justify-center",
  root: cn(
    "aspect-square mx-auto rounded-lg border border-border shadow-md bg-white",
    "w-full h-auto p-3",
    "@2xl:h-[700px] @2xl:w-[720px] @2xl:p-5"
  ),
  header: "text-center mb-4",
  header_clg_title: "@2xl:text-xl font-semibold text-gray-600 @2xl:text-lg",
  header_hostel_title: "@2xl:text-2xl font-bold text-gray-800 :text-base",
  meta_container: "mt-4 flex justify-between items-center text-sm",
  meta_item: "flex flex-col text-gray-700",
  meta_label: "font-bold",
  meta_value: "font-medium text-right",
  main: "mt-6 space-y-4 @2xl:text-sm text-gray-700 text-xs",
  field: "flex justify-between @2xl:flex-nowrap flex-wrap",
  label: "font-semibold",
  value: "text-right",
  note: "mt-6 text-muted-foreground italic text-xs",
  footer: "flex justify-between flex-wrap",
  qr_code: "mt-6 flex-0",
  signature: "mt-6 text-gray-800 font-semibold text-right text-xs",
  signature_value:
    "mt-3 @2xl:text-sm text-gray-700 font-bold italic text-right text-xs",
};

export default function OutpassRender({
  outpass,
  viewOnly = false,
}: OutpassRenderProps) {
  const outpassRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (outpassRef.current) {
      try {
        setIsDownloading(true);
        await new Promise((resolve) => setTimeout(resolve, 500)); // Ensures rendering completion
        const rect = outpassRef.current.getBoundingClientRect(); // Get actual size
        const scaleFactor = 2; // Improves quality

        const dataUrl = await toPng(outpassRef.current, {
          cacheBust: true,
          backgroundColor: "white",
          width: rect.width * scaleFactor,
          height: rect.height * scaleFactor,
          style: {
            transform: `scale(${scaleFactor})`,
            transformOrigin: "top left",
          },
        });

        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `Outpass_${outpass.student.rollNumber}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Outpass downloaded successfully.");
      } catch (e) {
        console.error(e);
        toast.error("Failed to download outpass. Please try again later.");
      } finally {
        setIsDownloading(false);
      }
    }
  };

  return (
    <>
      {!viewOnly && (
        <div className="flex justify-between items-center w-full gap-2 flex-wrap bg-card p-3 rounded-lg mb-4">
          <Heading level={6}>
            Requested OutPass
            <Badge
              size="sm"
              className="ml-2 capitalize"
              variant={
                outpass.status === "approved"
                  ? "success_light"
                  : outpass.status === "rejected" ||
                      outpass.status === "processed"
                    ? "destructive_light"
                    : outpass.status === "pending"
                      ? "warning_light"
                      : "default_light"
              }
            >
              {outpass.status}
            </Badge>
          </Heading>
          <div className="flex gap-2 justify-end items-center flex-wrap">
            <Button
              type="button"
              variant={
                outpass.status === "pending" ? "warning_light" : "default_light"
              }
              effect="shineHover"
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading || outpass.status === "pending"}
            >
              {outpass.status === "pending" ? (
                "Download not allowed yet"
              ) : (
                <>
                  {isDownloading ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    "Download"
                  )}
                  {!isDownloading ? <HiOutlineDownload /> : "Downloading..."}
                </>
              )}
            </Button>
            <ButtonLink
              variant="link"
              effect="hoverUnderline"
              size="sm"
              href="outpass/request"
            >
              Request Outpass
              <ArrowRight />
            </ButtonLink>
          </div>
        </div>
      )}
      <div className="w-full overflow-auto h-full relative">
        <div className={classNames.rootContainer}>
          <div ref={outpassRef} className={classNames.root}>
            <header className={classNames.header}>
              <h1 className={classNames.header_clg_title}>{orgConfig.name}</h1>
              <h2 className={classNames.header_hostel_title}>
                Office of {outpass.hostel.name}
              </h2>
            </header>

            <div className={classNames.meta_container}>
              <div className={classNames.meta_item}>
                <span className={classNames.meta_label}>Date</span>
                <span className={classNames.meta_value}>
                  {format(new Date(outpass.createdAt || ""), "dd/MM/yyyy")}
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
                        : outpass.status === "rejected" ||
                            outpass.status === "processed"
                          ? "destructive_light"
                          : outpass.status === "pending"
                            ? "warning_light"
                            : "default_light"
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
                  {format(
                    new Date(outpass.expectedOutTime || ""),
                    "dd/MM/yyyy hh:mm a"
                  )}
                </span>
              </div>
              <div className={classNames.field}>
                <span className={classNames.label}>Expected In Time:</span>
                <span className={classNames.value}>
                  {format(
                    new Date(outpass.expectedInTime || ""),
                    "dd/MM/yyyy hh:mm a"
                  )}
                </span>
              </div>
              <div className={classNames.field}>
                <span className={classNames.label}>Address:</span>
                <span className={classNames.value}>{outpass.address}</span>
              </div>
            </main>

            <section className={classNames.note}>
              <p>
                Undertaking: I hereby confirm that the information provided
                above is correct. I am responsible for adhering to the rules and
                regulations of the hostel. In case of any misconduct, I will be
                held accountable for disciplinary actions as per institute
                rules.
              </p>
              <p className="mt-4">
                For Office Use Only: This outpass is valid until{" "}
                <strong>
                  {format(
                    new Date(
                      outpass.validTill ||
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth(),
                          new Date().getDate(),
                          23,
                          59,
                          59,
                          999
                        )
                    ),
                    "dd/MM/yyyy hh:mm a"
                  )}
                </strong>
                {new Date(outpass.validTill || "").getTime() <
                  new Date().getTime() && (
                  <span className="text-red-500 italic"> (Expired)</span>
                )}
              </p>
            </section>
            <footer className={classNames.footer}>
              <div className={classNames.qr_code}>
                {/* <QRCodeSVG
                  value={outpass._id}
                  id={outpass._id}
                  size={256}
                  level="H"
                  title={outpass.student.rollNumber}
                  className="size-20"
                /> */}
                <BarCode
                  value={outpass._id}
                  className="max-w-xs"
                  height={100}
                />
              </div>
              <div className={classNames.signature}>
                <p className={classNames.signature}>Signature of Student</p>
                <p className={classNames.signature_value}>
                  {outpass.student.name}
                </p>
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
      </div>
    </>
  );
}
