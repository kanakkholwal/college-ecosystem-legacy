"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");

  useEffect(() => {
    setSearchTerm(searchParams.get("query") || "");
  }, [searchParams]);

  const handleSearch = useDebouncedCallback((term: string) => {
    console.log(`Searching... ${term}`);
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    router.push(`?${params.toString()}`);
  }, 300);

  return (
    <div className="flex items-center w-full rounded-xl relative group mx-auto sm:mx-4 mb-2 width-[calc(100%_-_2rem)]">
      <Search
        size={20}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 group:focus-within:text-primary/80"
      />
      <Input
        placeholder="Search users..."
        className="w-full pl-10"
        value={searchTerm}
        onChange={(e) => {
          const value = e.target.value;
          setSearchTerm(value);
          handleSearch(value);
        }}
      />
    </div>
  );
}
