"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotepadText } from "lucide-react";
import toast from "react-hot-toast";
import { assignRanks } from "~/actions/result";

export function AssignRankCard() {

  return <Card variant="glass">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">
        Assign Rank
      </CardTitle>
      <NotepadText className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <Button variant="default_light" size="sm" onClick={() => {
        console.log("Assign Rank")
        assignRanks()
        toast.promise(assignRanks(), {
          loading: 'Assigning Rank...',
          success: 'Rank Assigned',
          error: 'Failed to assign rank'
        })
      }}>Assign Rank</Button>
      <p className="text-xs text-gray-500">Assign rank to all students</p>
    </CardContent>
  </Card>
}