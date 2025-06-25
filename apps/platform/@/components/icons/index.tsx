import { GrArticle } from "react-icons/gr";
import { MdHistoryEdu } from "react-icons/md";


export type IconComponentType = {
    [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}
export const IconComponent = {
    "articles": GrArticle,
    "experiences": MdHistoryEdu
} as IconComponentType;

export type IconType = keyof typeof IconComponent;

export function Icon({ name, className }: { name: IconType; className?: string }) {
    const Icon = IconComponent[name];
    if (!Icon) {
        return null;
    }
    return <Icon className={className} />;
}