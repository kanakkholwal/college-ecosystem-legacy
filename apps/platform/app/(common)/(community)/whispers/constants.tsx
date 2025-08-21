
// annonymous whispers to share thoughts, confessions, or secrets, Gossip, Opinion, NSFW. Map to categories with appropiate icons from 
// https://lucide.dev/icons or react-icons or radix-icons

import { Drama, HatGlasses, VenetianMask } from "lucide-react";
import { FaEarListen } from "react-icons/fa6";

type Category = {
    name: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    description: string;
}
export const CATEGORIES: Category[] = [
    {
        name: "Gossip",
        Icon: VenetianMask, // Replace with actual icon component
        description: "Share the latest gossip and rumors.",
    },
    {
        name: "Opinion",
        Icon: FaEarListen , // Replace with actual icon component
        description: "Express your opinions on various topics.",
    },
    {
        name: "Confession",
        Icon: Drama, // Replace with actual icon component
        description: "Confess your secrets anonymously.",
    },
    {
        name: "NSFW",
        Icon: HatGlasses, // Replace with actual icon component
        description: "Share NSFW content responsibly.",
    },
]