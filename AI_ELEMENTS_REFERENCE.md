# AI SDK Elements Reference

> Install: `npx @anthropic-ai/elements install <component-name>`
> Docs: https://elements.ai-sdk.dev/components/

## Chatbot Components

### Conversation
Auto-scrolling message container with scroll-to-bottom button.
- `Conversation` - Root container
- `ConversationContent` - Message area
- `ConversationEmptyState` - Empty state placeholder (title, description, icon)
- `ConversationScrollButton` - Scroll-to-bottom FAB
- `ConversationDownload` - Export chat as Markdown
- **Use for**: Main chat wrapper. Replaces manual scroll management.

### Message
Individual message display with markdown, branching, and actions.
- `Message` - Wrapper (`from: "user" | "assistant" | "system"`)
- `MessageContent` - Content container
- `MessageResponse` - Markdown renderer (GFM, math/KaTeX, streaming-safe)
- `MessageActions` / `MessageAction` - Action buttons (copy, retry, like, etc.)
- `MessageBranch` - Response branching (multiple versions)
- `MessageBranchSelector` / `Previous` / `Next` / `Page`
- `MessageToolbar` - Horizontal action bar below messages
- **Use for**: Rendering messages with proper markdown. Replaces custom markdown component.
- **Note**: Requires `@source "../node_modules/streamdown/dist/*.js";` in globals.css

### Prompt Input
Composable text input with attachments, model selector, and actions.
- `PromptInput` - Root form (`onSubmit`, `accept`, `multiple`, `globalDrop`, `maxFiles`, `maxFileSize`)
- `PromptInputHeader` / `PromptInputBody` / `PromptInputFooter` - Layout sections
- `PromptInputTextarea` - Auto-resizing textarea
- `PromptInputSubmit` - Submit button (`status: ChatStatus` controls icon)
- `PromptInputTools` - Toolbar container
- `PromptInputButton` - Styled button with tooltip support
- `PromptInputActionMenu` - Dropdown menu for file upload, screenshots
- `PromptInputSelect` - Model selector dropdown
- **Hooks**: `usePromptInputAttachments()`, `usePromptInputController()`
- **Use for**: Chat input with file uploads, model switching, action menus.

### Suggestion
Horizontal scrollable row of clickable prompt suggestions.
- `Suggestions` - ScrollArea container
- `Suggestion` - Clickable button (`suggestion: string`, `onClick`)
- **Use for**: Empty state prompts, quick actions, follow-up suggestions.

### Shimmer
Animated text loading indicator with sweeping gradient.
- `Shimmer` - Single component (`children: string`, `duration`, `spread`, `as`)
- **Use for**: "Thinking..." states, progressive text reveals.

### Reasoning
Collapsible AI thinking/reasoning panel.
- `Reasoning` - Root (`isStreaming`, `open`, `duration`)
- `ReasoningTrigger` - Toggle header
- `ReasoningContent` - Reasoning text (Streamdown rendered)
- **Hook**: `useReasoning()`
- **Use for**: Extended thinking, reasoning model output (Claude, Deepseek R1).

### Chain of Thought
Step-by-step reasoning visualisation with search results and images.
- `ChainOfThought` - Root (collapsible)
- `ChainOfThoughtHeader` - Toggle trigger
- `ChainOfThoughtContent` - Steps container
- `ChainOfThoughtStep` - Individual step (`status: "complete" | "active" | "pending"`, `icon`, `label`, `description`)
- `ChainOfThoughtSearchResults` / `ChainOfThoughtSearchResult`
- `ChainOfThoughtImage` - Step image with caption
- **Use for**: Multi-step reasoning, agentic tool use progress, search workflows.

### Sources
Collapsible citation/reference display.
- `Sources` - Root container
- `SourcesTrigger` - Toggle (`count: number`)
- `SourcesContent` - Sources list
- `Source` - Individual source link (anchor element)
- **Use for**: RAG citations, web search results, document references.

### Inline Citation
In-text source attribution.
- **Use for**: Inline footnotes/references within message text.

### Attachments
File/media attachment display.
- `Attachments` - Container (`variant: "grid" | "inline" | "list"`)
- `Attachment` - Individual item
- `AttachmentPreview` - Media preview
- `AttachmentInfo` - Filename/type display
- `AttachmentRemove` - Remove button
- `AttachmentHoverCard` / `Trigger` / `Content` - Hover preview
- **Helpers**: `getMediaCategory()`, `getAttachmentLabel()`
- **Use for**: File uploads in chat, image previews, document attachments.

### Confirmation
User verification/approval UI.
- **Use for**: Tool call confirmations, destructive action approvals.

### Context
Conversation context management.
- **Use for**: System prompts, context windows, knowledge base selection.

### Model Selector
AI model picker.
- **Use for**: Switching between models (Claude, GPT, etc.).

### Queue / Task / Plan / Checkpoint
Agentic workflow components.
- **Use for**: Multi-step agent tasks, progress tracking, plan display.

---

## Code Components

### Code Block
Syntax-highlighted code with Shiki, line numbers, and copy button.
- `CodeBlock` - Root (`code`, `language`, `showLineNumbers`)
- `CodeBlockHeader` / `CodeBlockTitle` / `CodeBlockFilename`
- `CodeBlockActions` / `CodeBlockCopyButton`
- `CodeBlockLanguageSelector` - Language picker dropdown
- **Use for**: Code display in messages. Replaces react-syntax-highlighter.

### Artifact
Code output/preview display.
- **Use for**: Generated code artifacts, sandboxed previews.

### File Tree
Directory structure visualisation.
- **Use for**: Showing project structure, file navigation.

### Terminal
Command line interface display.
- **Use for**: CLI output, build logs, command results.

### Test Results
Test output display.
- **Use for**: Showing test pass/fail results.

### Stack Trace
Error information display.
- **Use for**: Error debugging, exception display.

### Sandbox / JSX Preview / Web Preview
Isolated code execution and preview.
- **Use for**: Live code demos, component previews.

### Snippet / Commit / Package Info / Schema Display / Environment Variables
Specialised code displays.

---

## Voice Components

### Audio Player / Speech Input / Transcription
Audio playback, capture, and speech-to-text.

### Mic Selector / Voice Selector / Persona
Input device and voice configuration.

---

## Workflow Components

### Canvas / Node / Edge / Connection / Controls / Panel / Toolbar
Visual workflow builder components.
- **Use for**: Node-based editors, flow diagrams, visual programming.

---

## Utility Components

### Image
Enhanced image display.

### Open In Chat
Integration button to open content in chat.

---

## Quick Start Pattern

```tsx
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse, MessageActions, MessageAction } from "@/components/ai-elements/message";
import { PromptInput, PromptInputBody, PromptInputFooter, PromptInputTextarea, PromptInputSubmit, PromptInputTools } from "@/components/ai-elements/prompt-input";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import { useChat } from "@ai-sdk/react";

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, regenerate } = useChat();

  return (
    <div className="flex h-full flex-col">
      <Conversation>
        <ConversationContent>
          {messages.length === 0 && (
            <ConversationEmptyState title="How can I help?" />
          )}
          {messages.map((msg) => (
            <Message key={msg.id} from={msg.role}>
              <MessageContent>
                {msg.parts.map((part, i) =>
                  part.type === "text" ? (
                    <MessageResponse key={i}>{part.text}</MessageResponse>
                  ) : null
                )}
              </MessageContent>
            </Message>
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {messages.length === 0 && (
        <Suggestions>
          <Suggestion suggestion="Tell me a joke" onClick={(s) => sendMessage({ text: s })} />
        </Suggestions>
      )}

      <PromptInput onSubmit={({ text }) => { sendMessage({ text }); setInput(""); }}>
        <PromptInputBody>
          <PromptInputTextarea value={input} onChange={(e) => setInput(e.target.value)} />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools />
          <PromptInputSubmit status={status} />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}
```
