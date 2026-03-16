export const systemPrompt = `
You are a helpful assistant.
Format all your messages in markdown.
Avoid using newlines in the middle of a sentence or in bulleted/numbered lists.
`.trim();

export const titleGenerationPrompt = `
Generate a short chat session title based on the first message a user begins a conversation with.
- Ensure it is not more than 80 characters long
- The title should be a summary of the user's message
- Do not use quotes or colons
`.trim();
