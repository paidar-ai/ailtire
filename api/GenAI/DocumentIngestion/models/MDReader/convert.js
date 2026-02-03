const fs = require('fs');

module.exports = {
    friendlyName: 'convert',
    description: 'Convert the document into a set of DocumentNodes attached to the document specified',
    static: true,
    inputs: {
        document: {
            type: 'ref',
            description: 'The document to convert',
            required: true,
        },
        config: {
            type: 'json',
            description: 'The configuration for the conversion',
        }
    },

    exits: {
        json: (obj) => {
            return obj;
        },
        success: (obj) => {
            return obj;
        },
        notFound: (obj) => {
            console.error("Object not Found:", obj);
            return null;
        },
    },


    fn: async function (obj, inputs, env) {

        const llamaindex = await import('llamaindex');

        let document = inputs.document;
        document.docType = "MD";

        if (typeof document === 'string') {
            document = TDocument.find({id: document});
        }
        let url = document.filename;

        let markdown = fs.readFileSync(url, 'utf-8');
        const documents = await chunkMarkdown(markdown);

        for(let i in documents) {
            let doc = documents[i];
            let node = document.addToNodes({text: doc.text,name: doc.name, metadata: doc.metadata});
            node.save();
        }
        document.save();
        return document;
    }
};

async function chunkMarkdown( markdown, options ) {
    const { marked } = await import('marked');
    const tokens = marked.lexer(markdown);

    const chunks = [];
    let paragraphIndex = 0;

    // Current heading hierarchy, e.g. ["Intro", "Background"]
    let headingPath = options?.documentTitle ? [options.documentTitle] : [];

    // Track if we’ve seen any heading at all
    let seenHeading = false;

    // Helper: ensure we have *some* heading path
    const ensureHeadingPath = () => {
        if (headingPath.length === 0) {
            const fallbackTitle = options.documentTitle ?? 'Document';
            headingPath = [fallbackTitle];
        }
    };

    // Helper: push a new chunk
    const addChunk = (text) => {
        if (!text.trim()) return;

        ensureHeadingPath();

        const metadata = {
            paragraph: paragraphIndex++,
            headingPath: [...headingPath],
        };

        const name = `${metadata.headingPath.join(' > ')} :: p${metadata.paragraph}`;

        chunks.push({
            text: text.trim(),
            name,
            metadata,
        });
    };

    // We will accumulate text for the current paragraph-like block
    let currentBlockLines = [];

    const flushCurrentBlock = () => {
        if (currentBlockLines.length > 0) {
            addChunk(currentBlockLines.join('\n'));
            currentBlockLines = [];
        }
    };

    for (const token of tokens) {
        switch (token.type) {
            case 'heading': {
                // Close any previous block before starting a heading
                flushCurrentBlock();

                const level = token.depth; // 1..6
                const text = token.text.trim();
                seenHeading = true;

                // Adjust headingPath according to level
                // Level 1: headingPath = [text]
                // Level 2: headingPath = [existing[0], text]
                // etc.
                headingPath = headingPath.slice(0, level - 1);
                headingPath[level - 1] = text;

                // You can choose whether to emit a chunk for the heading itself.
                // If you want chunks to include headings as part of the text for the
                // following content, you might skip adding a separate heading chunk.
                // Here, we skip adding a separate chunk, and let headings appear
                // together with the next paragraph.
                break;
            }

            case 'paragraph':
            case 'text': {
                // paragraph: normal paragraphs
                // text (outside lists) can sometimes appear; treat similarly
                currentBlockLines.push(token.text);
                flushCurrentBlock();
                break;
            }

            case 'code': {
                // Treat code blocks as their own chunks
                const fence = '```' + (token.lang || '');
                currentBlockLines.push(`${fence}\n${token.text}\n\`\`\``);
                flushCurrentBlock();
                break;
            }

            case 'list': {
                // Combine list items into one block
                const lines = [];
                for (const item of token.items) {
                    const bullet = token.ordered ? '1.' : '-';
                    // item.text may be single string; in more complex cases, you may need more logic
                    lines.push(`${bullet} ${item.text}`);
                }
                currentBlockLines.push(lines.join('\n'));
                flushCurrentBlock();
                break;
            }

            case 'blockquote': {
                // Combine blockquote tokens
                const textLines = token.tokens?.map(t => '>' + ('text' in t ? ' ' + (t).text : '') ) ?? [];
                currentBlockLines.push(textLines.join('\n'));
                flushCurrentBlock();
                break;
            }

            case 'space':
                // Blank line → separate blocks naturally; already covered by flush on next block
                break;

            default:
                // Ignore other token types for now (hr, table, etc.)
                break;
        }
    }

    // Flush last block
    flushCurrentBlock();

    // If no headings were found and no documentTitle was given,
    // we can retroactively assign a default heading to all chunks
    if (!seenHeading && !options.documentTitle) {
        const fallbackTitle = 'Document';
        for (const chunk of chunks) {
            chunk.metadata.headingPath = [fallbackTitle];
            chunk.name = `${fallbackTitle} :: p${chunk.metadata.paragraph}`;
        }
    }

    return chunks;
}