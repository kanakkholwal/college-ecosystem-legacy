"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IoMdOptions } from "react-icons/io";
import { useDebouncedCallback } from "use-debounce";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Suspense, useState } from "react";

type Props = {
  statuses: string[];
  types: string[];
};

export default function SearchBox({ statuses, types }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [open, setOpen] = useState(false);

  const handleSearch = useDebouncedCallback((term: string) => {
    console.log(`Searching... ${term}`);

    console.log(term);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);
  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("roomType");
    params.delete("currentStatus");
    replace(`${pathname}?${params.toString()}`);
  };
  const handleFilter = (key: string, value: string) => {
    console.log(`Searching... ${key} : ${value}`);

    const params = new URLSearchParams(searchParams);
    if (key) {
      params.set(key, value);
    } else {
      params.delete(value);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative flex items-stretch w-full rounded-full">
      <div className="absolute top-0 bottom-0 left-0">
        <Suspense
          fallback={
            <button className="relative flex h-12 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:border before:border-transparent before:bg-primary/10 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 dark:before:border-gray-700 dark:before:bg-gray-800 sm:w-max">
              <span className="relative text-base font-semibold text-primary dark:text-white">
                <IoMdOptions className="w-5 h-5" />
              </span>
            </button>
          }
        >
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="relative flex h-12 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:border before:border-transparent before:bg-primary/10 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 dark:before:border-gray-700 dark:before:bg-gray-800 sm:w-max">
                <span className="relative text-base font-semibold text-primary dark:text-white">
                  <IoMdOptions className="w-5 h-5" />
                </span>
              </button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader className="mb-5">
                <SheetTitle>Filter Rooms</SheetTitle>
                <SheetDescription>
                  Filter by current status, room type, etc.
                </SheetDescription>
              </SheetHeader>
              <div className="mb-4">
                <p className="text-sm font-semibold text-slate-600 mb-2">
                  By Departments
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="slate"
                    size="sm"
                    className={
                      "text-xs !h-8 " +
                      (searchParams.get("currentStatus")?.toString() === "all"
                        ? "bg-accent-foreground hover:bg-accent-foreground/90 text-white"
                        : "")
                    }
                    onClick={() => {
                      handleFilter("currentStatus", "all");
                    }}
                  >
                    All
                  </Button>
                  {statuses.map((status) => (
                    <Button
                      key={status}
                      variant="slate"
                      size="sm"
                      className={
                        "text-xs !h-8 capitalize " +
                        ((searchParams.get("currentStatus")?.toString() ??
                          "all") === status
                          ? "bg-accent-foreground hover:bg-accent-foreground/90 text-white"
                          : "")
                      }
                      onClick={() => {
                        handleFilter("currentStatus", status);
                      }}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm font-semibold text-slate-600 mb-2">
                  By Course Types
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="slate"
                    size="sm"
                    className={
                      "text-xs !h-8 " +
                      (searchParams.get("roomType")?.toString() === "all"
                        ? "bg-accent-foreground hover:bg-accent-foreground/90 text-white"
                        : "")
                    }
                    onClick={() => {
                      handleFilter("roomType", "all");
                    }}
                  >
                    All
                  </Button>
                  {types.map((type) => (
                    <Button
                      key={type}
                      variant="slate"
                      size="sm"
                      className={
                        "text-xs !h-8 capitalize " +
                        ((searchParams.get("roomType")?.toString() ?? "all") ===
                        type
                          ? "bg-accent-foreground hover:bg-accent-foreground/90 text-white"
                          : "")
                      }
                      onClick={() => {
                        handleFilter("roomType", type);
                      }}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mt-auto flex flex-col  gap-2 w-full ">
                <Button
                  variant="secondary"
                  onClick={() => {
                    clearFilters();
                    setOpen(false);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </Suspense>
      </div>
      <Input
        placeholder="Search by room Number"
        className="w-full rounded-full px-20 border border-border h-12 "
        defaultValue={searchParams.get("query")?.toString()}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
      <div className="absolute top-0 bottom-0 right-0">
        <button className="relative flex h-12 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max">
          <span className="relative text-base font-semibold text-white">
            <Search className="w-5 h-5" />
          </span>
        </button>
      </div>
    </div>
  );
}
