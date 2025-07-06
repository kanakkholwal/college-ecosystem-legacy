import { GrArticle } from "react-icons/gr";
import { MdHistoryEdu } from "react-icons/md";
import {
  Activity,
  BarChart2,
  BookOpen,
  Calendar,
  Code,
  Cpu,
  Github,
  Globe,
  Instagram,
  LayoutTemplate,
  Linkedin,
  Mail,
  Phone,
  ShieldCheck,
  Terminal,
  Twitter,
  Users
} from 'lucide-react';

export type IconComponentType = {
    [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}
export const IconComponent = {
    "articles": GrArticle,
    "experiences": MdHistoryEdu,
    "activity": Activity,
    "barchart": BarChart2,
    "book": BookOpen,
    "calendar": Calendar,
    "code": Code,
    "cpu": Cpu,
    "github": Github,
    "globe": Globe,
    "instagram": Instagram,
    "linkedin": Linkedin,
    "mail": Mail,
    "phone": Phone,
    "shield": ShieldCheck,
    "terminal": Terminal,
    "twitter": Twitter,
    "users": Users,
    "layout": LayoutTemplate,
    "default": LayoutTemplate, // Fallback icon
    "unknown": LayoutTemplate, // Fallback for unknown icons
} as IconComponentType;

export type IconType = keyof typeof IconComponent;

export function Icon({ name, className }: { name: IconType; className?: string }) {
    const Icon = IconComponent[name];
    if (!Icon) {
        return null;
    }
    return <Icon className={className} />;
}