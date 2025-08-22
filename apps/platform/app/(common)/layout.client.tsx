"use client";
import { Icon } from "@/components/icons";
import { BannerPanel } from "@/components/utils/banner";
import ConditionalRender from "@/components/utils/conditional-render";
import type { Session } from "~/auth/client";


const PROMO = {
    title: "Share your Personal Guide, Experiences",
    description:
        "Personal career experiences, articles, and case studies. You can also promote your articles on the site if they are valuable reads",
    label: (
        <>
            Share Now
            <Icon name="arrow-up-right" />
        </>
    ),
    showTill: "2025-12-31T19:00:00",
    getRedirectUrl: () => "https://forms.gle/NWAfkZngLozRjRJZ6",
    getConditionByUser: (user: Session["user"]) =>
        // user?.other_roles.includes(ROLES_ENUMS.STUDENT) &&
        // user?.gender === "not_specified",
        new Date() < new Date(PROMO.showTill),
};

export function LayoutClient({ user }: { user?: Session["user"] }) {
    return <>
        <ConditionalRender
            condition={PROMO.getConditionByUser(user!)}
        >

            <BannerPanel
                id="personal-guide-promo"
                title={PROMO.title}
                description={PROMO.description}
                redirectUrl={PROMO.getRedirectUrl()}
                isClosable={true}
                icon={<Icon name="rocket" className="size-4 text-primary" />}
                btnProps={{
                    children: PROMO.label,
                    variant: "default",
                    shadow: "default",
                    transition: "damped",
                    effect: "none",
                }}
            // Show only to students and non-binary users
            // Condition can be changed as per requirement
            // Only show till the specified date
            // You can also add more conditions like checking if user has already submitted the form etc.
            // For now, it's just based on date
            // And user role and

            />
        </ConditionalRender>


    </>;
}