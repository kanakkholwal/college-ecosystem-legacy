"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { IoMdOptions } from "react-icons/io";
import { useDebouncedCallback } from "use-debounce";

type FilterOption = {
  key: string;
  label: string;
  values: { value: string; label: string }[];
};

type SearchBoxProps = {
  searchPlaceholder: string;
  filterOptions?: FilterOption[];
  searchParamsKey?: string;
  debounceTime?: number;
  filterDialogTitle?: string;
  filterDialogDescription?: string;
  variant?: "default" | "expanded";
};

export default function BaseSearchBox({
  searchPlaceholder = "Search...",
  filterOptions = [],
  searchParamsKey = "query",
  debounceTime = 300,
  filterDialogTitle = "Filter",
  filterDialogDescription = "Filter by different options",
  variant = "default",
}: SearchBoxProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [open, setOpen] = useState(variant === "expanded" ? true : false);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (term) {
      params.set(searchParamsKey, term);
    } else {
      params.delete(searchParamsKey);
    }
    replace(`${pathname}?${params.toString()}`);
  }, debounceTime);

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value === "none" || value === "all") {
      params.delete(key);
    } else if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams);
    filterOptions.forEach((option) => {
      params.delete(option.key);
    });
    replace(`${pathname}?${params.toString()}`);
  };

  const hasActiveFilters = filterOptions.some((option) =>
    searchParams.get(option.key)
  );

  return (
    <div
      className={cn(
        "w-full",
        variant === "expanded"
          ? "grid gap-4"
          : "relative flex items-stretch rounded-full"
      )}
    >
      <div
        className={cn(
          "relative flex items-stretch w-full rounded-full",
          variant === "expanded" ? "h-auto" : ""
        )}
      >
        {filterOptions.length > 0 && (
          <div className="absolute top-0 bottom-0 left-0">
            {variant === "default" ? (
              <Suspense
                fallback={
                  <Button
                    type="button"
                    aria-label="Filter"
                    title="Filter"
                    variant="glass"
                    rounded="full"
                    size="lg"
                    className="border border-border hover:border-primary h-10"
                  >
                    <span className="relative text-base font-semibold text-primary">
                      <IoMdOptions className="size-5" />
                    </span>
                  </Button>
                }
              >
                <ResponsiveDialog
                  title={filterDialogTitle}
                  description={filterDialogDescription}
                  btnProps={{
                    variant: "glass",
                    size: "lg",
                    rounded: "full",
                    className: "border border-border",
                    children: (
                      <span className="relative text-base font-semibold text-primary">
                        <IoMdOptions className="size-5" />
                      </span>
                    ),
                  }}
                >
                  {/* {hasActiveFilters && (
                                        <div className="flex justify-end mb-2">
                                            <Button
                                                variant="link"
                                                size="sm"
                                                className="text-xs !h-8"
                                                onClick={clearAllFilters}
                                            >
                                                Clear all filters
                                            </Button>
                                        </div>
                                    )} */}

                  {filterOptions.map((option) => (
                    <div key={option.key} className="mb-4">
                      <p className="text-muted-foreground mb-2">
                        <span className="font-medium text-xs">
                          {option.label}
                        </span>
                        {searchParams.get(option.key) && (
                          <Button
                            variant="link"
                            size="xs"
                            className="capitalize ml-2"
                            onClick={() => handleFilter(option.key, "none")}
                          >
                            Clear
                          </Button>
                        )}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {option.values.map(({ value, label }) => (
                          <Button
                            key={value}
                            variant={
                              searchParams.get(option.key) === value
                                ? "default_light"
                                : "outline"
                            }
                            size="xs"
                            className="capitalize"
                            onClick={() => handleFilter(option.key, value)}
                          >
                            {label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </ResponsiveDialog>
              </Suspense>
            ) : (
              <Button
                type="button"
                aria-label="Filter"
                title="Filter"
                onClick={() => setOpen(!open)}
                variant="glass"
                rounded="full"
                size="lg"
                className="border border-border h-11.5"
              >
                <span className="relative text-base font-semibold text-primary">
                  <IoMdOptions className="size-5" />
                </span>
              </Button>
            )}
          </div>
        )}

        <Input
          placeholder={searchPlaceholder}
          className={cn(
            "w-full rounded-full h-12",
            filterOptions.length > 0 ? "px-20" : "px-6",
            variant === "expanded" ? "bg-card" : "border border-border"
          )}
          defaultValue={searchParams.get(searchParamsKey)?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
        />

        <div className="absolute top-0 bottom-0 right-0">
          <Button
            type="button"
            aria-label="Search"
            title="Search"
            variant={variant === "expanded" ? "default" : "glass"}
            rounded="full"
            size="lg"
            className="relative flex h-12 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
          >
            <span className="relative text-base font-semibold text-white">
              <Search className="size-5" />
            </span>
          </Button>
        </div>
      </div>

      {variant === "expanded" && filterOptions.length > 0 && (
        <div
          className={cn(
            open ? "h-10" : "h-0",
            "transition-all delay-150 duration-300 overflow-hidden w-full flex gap-2 justify-start items-center"
          )}
        >
          <div>
            <h6 className="font-medium text-xs text-muted-foreground">
              Filter by
            </h6>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterOptions.flatMap((option) =>
              option.values.map(({ value, label }) => (
                <Button
                  key={`${option.key}-${value}`}
                  variant={
                    searchParams.get(option.key) === value
                      ? "default_light"
                      : "outline"
                  }
                  size="sm"
                  className="capitalize"
                  onClick={() => handleFilter(option.key, value)}
                >
                  {label}
                </Button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
