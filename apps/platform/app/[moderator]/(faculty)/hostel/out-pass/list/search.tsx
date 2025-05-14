"use client";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Search, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type searchParamsType = {
  query?: string;
  offset?: number;
  limit?: number;
  sortBy?: "desc" | "asc";
};

export default function SearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [searchField, setSearchField] = useState<searchParamsType["query"]>(
    searchParams.get("query") || ""
  );

  const [sortBy, setSortBy] = useState<searchParamsType["sortBy"]>(
    (searchParams.get("sortBy") as "desc" | "asc") || "desc"
  );

  const [offset, setOffset] = useState<searchParamsType["offset"]>(
    Number.parseInt(searchParams.get("offset") || "0", 0)
  );
  const [limit, setLimit] = useState<searchParamsType["limit"]>(
    Number.parseInt(searchParams.get("limit") || "100") || 100
  );

  // const [filterField, setFilterField] = useState<searchParamsType["filterField"]>(searchParams.get("filterField") || "");
  // const [filterOperator, setFilterOperator] = useState<searchParamsType["filterOperator"]>((searchParams.get("filterOperator") as searchParamsType["filterOperator"]) || "eq");
  // const [filterValue, setFilterValue] = useState<searchParamsType["filterValue"]>(searchParams.get("filterValue") || "");

  useEffect(() => {
    setSearchField(searchParams.get("query") || "");
    setOffset(Number.parseInt(searchParams.get("offset") || "0", 0));
    setLimit(Number.parseInt(searchParams.get("limit") || "100", 100));

    setSortBy((searchParams.get("sortBy") as "desc" | "asc") || "desc");
  }, [searchParams]);

  const updateParams = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchField) params.set("searchField", searchField);

    if (sortBy) params.set("sortBy", sortBy);
    if (offset) params.set("offset", offset.toString());
    if (limit) params.set("limit", limit.toString());
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="space-y-4 group mx-auto sm:mx-4 mb-2 width-[calc(100%_-_2rem)]">
      {/* Search Input */}
      <div className="flex items-center w-full rounded-xl relative gap-3">
        <Search
          size={20}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 group-focus-within:text-primary/80"
        />
        <Input
          placeholder="Search query..."
          className="w-full pl-10"
          type="search"
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
        />
        <Button
          variant="default_light"
          size="sm"
          onClick={() => setOpen(!open)}
        >
          <SlidersHorizontal />
        </Button>
        <Button
          size="sm"
          onClick={() => {
            updateParams(); // Apply changes immediately
          }}
        >
          Apply
        </Button>
      </div>

      <div
        className={cn(
          "flex items-end flex-wrap gap-2 text-sm text-muted-foreground",
          open ? "h-16" : "h-0",
          "transition-all delay-150 duration-300 overflow-hidden w-full"
        )}
      >
        <div>
          <p className="text-muted-foreground font-medium text-sm mb-1">
            Search Field
          </p>

          {/* Sorting Options */}
          <div className="flex items-center space-x-4">
            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value as "desc" | "asc");
              }}
            >
              <SelectTrigger className="w-full h-8">
                <SelectValue placeholder="Sort By" className="h-6 text-sm" />
              </SelectTrigger>
              <SelectContent>
                {["asc", "desc"].map((field) => {
                  return (
                    <SelectItem key={field} value={field}>
                      {field}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Separator orientation="vertical" />
        <div>
          <p className="text-muted-foreground font-medium text-sm mb-1">
            Limit & Offset
          </p>
          <div className="flex items-center space-x-4">
            <Input
              type="number"
              placeholder="Limit"
              className="h-8 max-w-16"
              value={limit}
              min={1}
              max={500}
              onChange={(e) => setLimit(Number.parseInt(e.target.value))}
            />
            <Input
              placeholder="Offset"
              className="h-8 max-w-16"
              type="number"
              value={offset}
              min={0}
              onChange={(e) => setOffset(Number.parseInt(e.target.value))}
              disabled={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
