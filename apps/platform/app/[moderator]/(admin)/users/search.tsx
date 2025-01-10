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
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


type searchParamsType = {
  searchField?: "email" | "name" | undefined;
  searchOperator?: "contains" | "starts_with" | "ends_with" | undefined;
  searchValue?: string;
  offset?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc" | undefined;
  filterField?: string | undefined;
  filterOperator?: "eq" | "ne" | "lt" | "lte" | "gt" | "gte" | undefined;
  filterValue?: string | undefined;
}

export default function SearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchField, setSearchField] = useState<searchParamsType["filterField"]>(searchParams.get("searchField") || "name");
  const [searchOperator, setSearchOperator] = useState<searchParamsType["searchOperator"]>((searchParams.get("searchOperator") as searchParamsType["searchOperator"]) || "contains");
  const [searchValue, setSearchValue] = useState<searchParamsType["searchValue"]>(searchParams.get("searchValue") || "");

  const [sortBy, setSortBy] = useState<searchParamsType["sortBy"]>(searchParams.get("sortBy") || "createdAt");
  const [sortDirection, setSortDirection] = useState<searchParamsType["sortDirection"]>((searchParams.get("sortDirection") as searchParamsType["sortDirection"]) || "desc");

  const [offset, setOffset] = useState<searchParamsType["offset"]>(Number.parseInt(searchParams.get("offset") || "0", 0));
  const [limit, setLimit] = useState<searchParamsType["limit"]>(Number.parseInt(searchParams.get("limit") || "100") || 100);

  // const [filterField, setFilterField] = useState<searchParamsType["filterField"]>(searchParams.get("filterField") || "");
  // const [filterOperator, setFilterOperator] = useState<searchParamsType["filterOperator"]>((searchParams.get("filterOperator") as searchParamsType["filterOperator"]) || "eq");
  // const [filterValue, setFilterValue] = useState<searchParamsType["filterValue"]>(searchParams.get("filterValue") || "");

  useEffect(() => {
    setSearchField((searchParams.get("searchField") as searchParamsType["filterField"]) || "name");
    setSearchOperator((searchParams.get("searchOperator") as searchParamsType["searchOperator"]) || "contains");
    setSearchValue((searchParams.get("searchValue") as string) || "");
    setSortBy((searchParams.get("sortBy") as string) || "createdAt");
    setSortDirection((searchParams.get("sortDirection") as searchParamsType["sortDirection"]) || "desc");
  }, [searchParams]);

  const updateParams = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchField) params.set("searchField", searchField);
    if (searchOperator) params.set("searchOperator", searchOperator);
    if (searchValue) params.set("searchValue", searchField === "email" ? searchValue.toLowerCase() : searchValue.toUpperCase());
    if (sortBy) params.set("sortBy", sortBy);
    if (sortDirection) params.set("sortDirection", sortDirection);
    if (offset) params.set("offset", offset.toString());
    if (limit) params.set("limit", limit.toString());
    router.replace(`?${params.toString()}`);
  }

  return (
    <div className="space-y-4 group mx-auto sm:mx-4 mb-2 width-[calc(100%_-_2rem)]">
      {/* Search Input */}
      <div className="flex items-center w-full rounded-xl relative">
        <Search
          size={20}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 group-focus-within:text-primary/80"
        />
        <Input
          placeholder="Search query..."
          className="w-full pl-10"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}

        />
      </div>

      <div className="flex items-end flex-wrap gap-2 text-sm text-gray-600">
        <div>
          <p className="text-gray-600 font-semibold text-sm">Search Field</p>
          <div className="flex items-center space-x-4">
            {/* Search Field */}
            <Select
              value={searchField}
              onValueChange={(value) => setSearchField(value)}
            >
              <SelectTrigger className="w-full h-8">
                <SelectValue placeholder="Field" className="h-6 text-sm" />
              </SelectTrigger>
              <SelectContent>
                {["email", "name"].map((field) => {
                  return (
                    <SelectItem
                      key={field}
                      value={field}
                    >
                      {field}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {/* Search Operator */}
            <Select
              value={searchOperator}
              onValueChange={(value) => setSearchOperator(value as searchParamsType["searchOperator"])}
            >
              <SelectTrigger className="w-full h-8">
                <SelectValue placeholder="searchOperator" className="h-6 text-sm" />
              </SelectTrigger>
              <SelectContent>
                {["contains", "starts_with", "ends_with"].map((operator) => {
                  return (
                    <SelectItem
                      key={operator}
                      value={operator}
                    >
                      {operator}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Separator orientation="vertical" />
        <div>
          <p className="text-gray-600 font-semibold text-sm">Search Field</p>

          {/* Sorting Options */}
          <div className="flex items-center space-x-4">
            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value);
              }}
            >
              <SelectTrigger className="w-full h-8">
                <SelectValue placeholder="Sort By" className="h-6 text-sm" />
              </SelectTrigger>
              <SelectContent>
                {["createdAt", "name", "email"].map((field) => {
                  return (
                    <SelectItem
                      key={field}
                      value={field}
                    >
                      {field}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <Select
              value={sortDirection}
              onValueChange={(value) => setSortDirection(value as searchParamsType["sortDirection"])}
            >
              <SelectTrigger className="w-full h-8">
                <SelectValue placeholder="Sort Direction" className="h-6 text-sm" />
              </SelectTrigger>
              <SelectContent>
                {["asc", "desc"].map((direction) => {
                  return (
                    <SelectItem
                      key={direction}
                      value={direction}
                    >
                      {direction}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Separator orientation="vertical" />
        <div>
          <p className="text-gray-600 font-semibold text-sm">Limit & Offset</p>
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
        <Separator orientation="vertical" />
        {/* Apply Button */}
        <Button
          size="sm"
          onClick={() => {
            updateParams(); // Apply changes immediately
          }}
        >
          Apply
        </Button>

      </div>
    </div>
  );
}
