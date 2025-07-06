import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Mail, Phone, ShieldCheck, Users } from "lucide-react";
import { ClubTypeJson } from "~/models/clubs";
import { ButtonLink } from "../utils/link";

interface ClubCardProps {
    club: ClubTypeJson
}

export function ClubCardEdit({ club }: ClubCardProps) {
    return (
        <Card className="w-full max-w-2xl overflow-hidden shadow-lg">
            <div
                className="h-2 w-full"
                style={{ backgroundColor: club.theme?.primaryColor }}
            />

            <CardHeader className="flex flex-row items-start gap-4 pb-2">
                <Avatar className="h-16 w-16 border-2" >
                    <AvatarImage src={club.logo} alt={`${club.name} logo`} />
                    <AvatarFallback>{club.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-xl font-bold">{club.name}</CardTitle>
                        {club.isVerified && (
                            <ShieldCheck className="size-4 text-blue-500" />
                        )}
                    </div>
                    <CardDescription className="text-sm italic">
                        {club.tagline}
                    </CardDescription>
                    <div className="flex flex-wrap gap-1 pt-1">
                        <Badge variant="outline">{club.category}</Badge>
                        <Badge variant="outline">{club.club_type}</Badge>
                        <Badge variant="outline">{club.operationAs}</Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <p className="text-sm">{club.description}</p>

                <div className="flex flex-wrap gap-2">
                    {club.tags.map((tag) => (
                        <Badge
                            key={tag}
                            variant="default"
                        >
                            {tag}
                        </Badge>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 opacity-70" />
                            <span>{club.members.length} members</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 opacity-70" />
                            <span>{club.clubEmail}</span>
                            {club.isClubEmailVerified && (
                                <ShieldCheck className="size-3 text-green-500" />
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <Globe className="h-4 w-4 opacity-70" />
                            <a
                                href={club.customDomain}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                                style={{ color: club.theme?.secondaryColor }}
                            >
                                {club.customDomain?.replace(/^https?:\/\//, '')}
                            </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">President:</span>
                            <span>{club.president.name}</span>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${club.president.email}`} target="_blank" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Contact President
                    </a>
                </Button>
                <div className="flex gap-2">
                    <ButtonLink variant="default_light" size="sm"
                        href={`clubs/${club._id}?edit=true`}
                    >
                        Edit Club
                    </ButtonLink>
                    <ButtonLink size="sm" 
                        href={`/clubs/${club._id}`} target="_blank" rel="noopener noreferrer"
                    >
                        View Club
                    </ButtonLink>
                </div>
            </CardFooter>
        </Card>
    );
}

export function ClubCardDisplay({ club }: ClubCardProps) {
    return (
        <Card className="w-full max-w-2xl overflow-hidden shadow-lg">
            <div
                className="h-2 w-full"
                style={{ backgroundColor: club.theme?.primaryColor }}
            />


            <CardHeader className="flex flex-row items-start gap-4 pb-2">
                <Avatar className="h-16 w-16 border-2" >
                    <AvatarImage src={club.logo} alt={`${club.name} logo`} />
                    <AvatarFallback>{club.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-xl font-bold">{club.name}</CardTitle>
                        {club.isVerified && (
                            <ShieldCheck className="size-4 text-blue-500" />
                        )}
                    </div>
                    <CardDescription className="text-sm italic">
                        {club.tagline}
                    </CardDescription>
                    <div className="flex flex-wrap gap-1 pt-1">
                        <Badge variant="outline">{club.category}</Badge>
                        <Badge variant="outline">{club.club_type}</Badge>
                        <Badge variant="outline">{club.operationAs}</Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <p className="text-sm">{club.description}</p>

                <div className="flex flex-wrap gap-2">
                    {club.tags.map((tag) => (
                        <Badge
                            key={tag}
                            variant="default"
                        >
                            {tag}
                        </Badge>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 opacity-70" />
                            <span>{club.members.length} members</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 opacity-70" />
                            <span>{club.clubEmail}</span>
                            {club.isClubEmailVerified && (
                                <ShieldCheck className="size-3 text-green-500" />
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <Globe className="h-4 w-4 opacity-70" />
                            <a
                                href={club.customDomain}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                                style={{ color: club.theme?.secondaryColor }}
                            >
                                {club.customDomain?.replace(/^https?:\/\//, '')}
                            </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">President:</span>
                            <span>{club.president.name}</span>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${club.president.email}`} target="_blank" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Contact President
                    </a>
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <a href={`tel:${club.president.phoneNumber}`} target="_blank" className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Call
                        </a>
                    </Button>
                    <Button size="sm" >
                        Join Club
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
