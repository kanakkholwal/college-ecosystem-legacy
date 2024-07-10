"use client";
import { Button } from "@/components/ui/button";
import { useActionState } from "@/hooks/useActionState";

import { updateRanks } from "src/lib/result";

export default function UpdateRanksCard() {
  const [run, { error, loading }] = useActionState(updateRanks);

  return (
    <div className="bg-white/20 backdrop-blur-lg p-4 rounded-lg shadow-md">
      <h4 className="text-lg font-bold">
        {loading
          ? "Updating Ranks..."
          : error
            ? "Error updating ranks"
            : "Update Ranks"}
      </h4>
      <h3 className="text-primary font-bold tracking-wide text-3xl mt-4">
        <Button
          onClick={run}
          variant="default_light"
          size="sm"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Ranks"}
        </Button>
      </h3>
    </div>
  );
}
