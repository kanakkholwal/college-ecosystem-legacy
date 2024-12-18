"use client";
import { Badge } from '@/components/ui/badge';
import { useSocketStatus } from '@/hooks/useSocketStatus';

const BASED_SERVER_URL = 'https://server.nith.eu.org';

export default function ScrapeResultPage() {
    const [status,socket]= useSocketStatus(BASED_SERVER_URL,{
        path:"/ws/results-scraping",
    });
    
    return (<>
        <div className="w-full flex gap-4 p-4">
            Connection
            {Object.entries(status).map(([key,value])=>{
                return <Badge key={key} className="flex gap-2" variant="info_light" size="sm">
                    <span>{key}</span>
                    <span>{value}</span>
                </Badge>
            })}
        </div>

    </>)
}