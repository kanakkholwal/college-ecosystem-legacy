import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BranchChanger from "./components/branch-change";
import Scraper from "./components/scraper";

export default async function AdminResultPage() {
  return (
    <>
      <Tabs defaultValue="scrape" className="mt-10">
        <TabsList>
          <TabsTrigger value="scrape">Scrape Results</TabsTrigger>
          <TabsTrigger value="branch-change">Branch Change</TabsTrigger>
        </TabsList>
        <TabsContent value="scrape" className="space-y-8 pt-4">
          <Scraper />
        </TabsContent>
        <TabsContent value="branch-change" className="space-y-8 pt-4">
          <BranchChanger />
        </TabsContent>
      </Tabs>
    </>
  );
}
