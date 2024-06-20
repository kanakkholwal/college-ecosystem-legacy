import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getBasicInfo } from "./actions";

export default async function Page() {
  const basicInfo = await getBasicInfo();

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold">Results Overview</h1>
        <p className="text-sm text-gray-700 font-semibold">
          As of {new Date(basicInfo.asOf).toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white/20 backdrop-blur-lg p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-bold">Total Results</h4>
          <h3 className="text-primary font-bold tracking-wide text-3xl mt-4">
            {basicInfo.counts.results}
          </h3>
        </div>
        <div className="bg-white/20 backdrop-blur-lg p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-bold">Total Branches</h4>
          <h3 className="text-primary font-bold tracking-wide text-3xl mt-4">
            {basicInfo.counts.branches}
          </h3>
        </div>
        <div className="bg-white/20 backdrop-blur-lg p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-bold">Total Batches</h4>
          <h3 className="text-primary font-bold tracking-wide text-3xl mt-4">
            {basicInfo.counts.batches}
          </h3>
        </div>
      </div>
      <Tabs defaultValue="scrape" className="w-full">
        <TabsList className="w-full h-14 px-2 gap-2">
          <TabsTrigger value="scrape" className="text-md w-full">
            Scrape Results
          </TabsTrigger>
          <TabsTrigger value="rank" className="text-md w-full">
            Rank Results
          </TabsTrigger>
        </TabsList>
        <TabsContent value="scrape" className="space-y-8 p-4">
          <div className="flex w-full flex-wrap justify-between items-center">
            <h4 className="text-lg font-bold">Scrape Results</h4>
            <div className="flex gap-2">
              <Input type="text" placeholder="Roll No" size={24} />
              <Button>Scrape</Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="rank" className="space-y-8 p-4">
          <div className="flex w-full flex-wrap justify-between items-center">
            <h4 className="text-lg font-bold">Rank Results</h4>
            <div className="flex gap-2">
              <Input type="text" placeholder="Roll No" size={24} />
              <Button>Rank</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
