import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Scraper from "./components/scraper";

export default async function AdminResultPage() {
  return (
    <>
      <Tabs defaultValue="scrape" className="w-full">
        <TabsList className="w-full h-14 px-2 gap-2">
          <TabsTrigger value="scrape" className="text-md w-full">
            Scrape Results
          </TabsTrigger>
          <TabsTrigger value="branch-change" className="text-md w-full">
            Branch Change
          </TabsTrigger>
        </TabsList>
        <TabsContent value="scrape" className="space-y-8 p-4">
          <Scraper />
        </TabsContent>
        <TabsContent value="branch-change" className="space-y-8 p-4">
          <div className="flex w-full flex-wrap justify-between items-center">
            <h4 className="text-lg font-bold">Branch Change</h4>
            <div className="flex gap-2">
              <Input type="text" placeholder="Roll No" size={24} />
              <Input type="text" placeholder="Branch" size={24} />
              <Button>Change Branch</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
