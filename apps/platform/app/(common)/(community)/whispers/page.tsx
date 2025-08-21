"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Eye, EyeOff, Send } from "lucide-react";
import { useState } from "react";
import { createWhisper } from "./actions";

export default function ConfessionPage() {
  const [confession, setConfession] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confession.trim()) return;

    try {
      const formData = new FormData();
      formData.append("confession", confession);
      formData.append("isAnonymous", String(isAnonymous));

      const response = await createWhisper(confession, isAnonymous);
      if (response.status === 200) {
        setConfession("");
        setIsAnonymous(true);
        // Optionally, show a success message or update the UI
        console.log("Whisper created successfully:", response.whisper);
        toast({
          title: "Whisper Created",
          description: "Your whisper has been posted successfully.",
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create whisper.",
          variant: "destructive",
        });
        // Handle error response
        console.error("Failed to create whisper:", response.message);
      }
    } catch (error) {
      console.error("Error creating whisper:", error);
    }
  };

  return (
    <div className="md:col-span-3 w-full space-y-4 pr-2 min-h-screen grid grid-cols-1 gap-4">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center pt-4"
      >
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
          Whisper Room
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Share your thoughts, opinions, and secrets. Anonymous or not, your
          voice matters.
        </p>
      </motion.div>

      {/* Confession Box */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-6 w-full"
      >
        <Card className="shadow-xl bg-card/80 backdrop-blur-xl border border-border/40 rounded-2xl">
          <CardContent className="p-6 space-y-6">
            {/* Anonymity Toggle */}
            <div className="flex items-center justify-between">
              <Badge
                variant={isAnonymous ? "default_light":"outline"}
                className={cn(
                  "cursor-pointer select-none transition-colors",
                )}
                onClick={() => setIsAnonymous(!isAnonymous)}
              >
                {isAnonymous ? (
                  <div className="flex items-center gap-1">
                    <EyeOff className="h-4 w-4" /> Anonymous
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" /> Public
                  </div>
                )}
              </Badge>
            </div>

            {/* Input Box */}
            <Textarea
              value={confession}
              onChange={(e) => setConfession(e.target.value)}
              placeholder="What's on your mind?..."
              className="resize-none min-h-[120px] rounded-xl border-border focus:ring-primary focus-visible:outline-none"
            />

            {/* Submit */}
            <Button
              className="w-full rounded-xl text-base font-medium gap-2"
              disabled={!confession.trim()}
            >
              <Send />
              Post Confession
            </Button>
          </CardContent>
        </Card>
      </motion.form>

      {/* Feed Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-12 w-full space-y-4"
      >
        {[1, 2, 3].map((item) => (
          <Card
            key={item}
            className="bg-card/70 backdrop-blur-xl border border-border/30 shadow-lg hover:shadow-primary/20 transition rounded-2xl"
          >
            <CardContent className="p-5 space-y-2">
              <p className="text-base leading-relaxed">
                {item === 1
                  ? "Sometimes I feel like the library is more fun than the fest."
                  : item === 2
                  ? "Why does the canteen food taste like it holds grudges?"
                  : "Shoutout to the professor who actually makes 8 AM classes worth it."}
              </p>
              <span className="text-xs text-muted-foreground">
                {item % 2 === 0 ? "Anonymous" : "Public"}
              </span>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  );
}
