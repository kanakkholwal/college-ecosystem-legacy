"use client";

import MarkdownView from "@/components/common/markdown/view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Write } from "./write";



interface FancyAreaProps {
    textValue: string;
    setTextValue: (value: string) => void;
    disabled?:boolean
}

export function FancyArea({ textValue, setTextValue,disabled }: FancyAreaProps) {
    // const [textValue, setTextValue] = React.useState(defaultText);

    return (
        <Tabs
            defaultValue="write"
            className="w-full"
        >
            <TabsList>
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="write">
                <Write textValue={textValue} setTextValue={setTextValue} disabled={disabled}/>
            </TabsContent>
            <TabsContent value="preview">
                <MarkdownView
                    className="w-full overflow-auto prose max-w-full dark:prose-invert prose-sm min-h-[159.5008px] px-1 border border-transparent prose-headings:font-cal"
>
                    {textValue}
                </MarkdownView>
            </TabsContent>
        </Tabs>
    );
};