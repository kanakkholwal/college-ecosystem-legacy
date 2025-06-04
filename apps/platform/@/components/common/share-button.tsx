"use client"

import { useShare } from "@/hooks/useShare"
import { Button, ButtonProps } from "../ui/button"

type ShareButtonProps = {
    data: {
        title?: string
        text?: string
        url?: string
        image?: string
    }
} & ButtonProps

function ShareButton({ data, ...props }: ShareButtonProps) {
    const { share } = useShare({
        title: data.title,
        text: data.text,
        url: data.url,
        image: data.image,
    })
    return <Button
        {...props}
        onClick={() => share()}
    />
}
ShareButton.displayName = "ShareButton"
export default ShareButton