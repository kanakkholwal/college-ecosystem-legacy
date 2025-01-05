"use client";
import { NotepadText } from "lucide-react";
import {assignRanks} from "./actions";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AssignRankCard(){

        return  <Card variant="glass">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Assign Rank
          </CardTitle>
          <NotepadText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <Button variant="default_light" onClick={() => {
                console.log("Assign Rank")
                assignRanks()
                toast.promise(assignRanks(), {
                    loading: 'Assigning Rank...',
                    success: 'Rank Assigned',
                    error: 'Failed to assign rank'
                })
            }}>Assign Rank</Button>
        </CardContent>
      </Card>
}