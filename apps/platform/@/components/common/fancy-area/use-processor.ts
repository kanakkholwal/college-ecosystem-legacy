// import { useEffect, useState } from 'react';
// import { rehype } from 'rehype';
// import rehypeRaw from "rehype-raw";
// import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
// import remarkParse from "remark-parse";
// import remarkRehype from "remark-rehype";
// import { unified } from "unified";

// export function useProcessor(md: string) {
//   const [content, setContent] = useState<React.ReactNode>(null);

//   useEffect(() => {
//     if (!md) return; // Ensure md is not empty or undefined

//     const processor = unified()
//       .use(remarkParse)
//       .use(remarkRehype, { allowDangerousHtml: true })
//       .use(rehypeRaw)
//       .use(rehypeSanitize, {
//         ...defaultSchema,
//         tagNames: [...(defaultSchema.tagNames || []), "mention"],
//         attributes: {
//           ...defaultSchema.attributes,
//           mention: ["handle"]
//         }
//       })
//       .use(rehype);

//     processor.process(md).then((file) => {
//       setContent(file.result as React.ReactNode);
//     });

//     // return () => {
//     //   // Cleanup function to abort processing if component unmounts
//     //   processor.abort();
//     // };
//   }, [md]);

//   return content;
// }
