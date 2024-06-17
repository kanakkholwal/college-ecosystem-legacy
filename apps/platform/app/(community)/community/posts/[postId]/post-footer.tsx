"use client";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { ThumbsUp } from 'lucide-react';

export default function PostFooter(){


    return (<CardFooter>
        <div className="flex gap-2 items-center">
            <Button 
                // variant={""}
            >
                <ThumbsUp size={16} />
                <span>Like</span>
            </Button>
        </div>

    </CardFooter>)

}