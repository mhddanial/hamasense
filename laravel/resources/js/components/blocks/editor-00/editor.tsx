import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { EditorState, SerializedEditorState, $getRoot, $insertNodes } from "lexical"
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useEffect, useRef } from "react"

import { editorTheme } from "@/components/editor/themes/editor-theme"
import { TooltipProvider } from "@/components/ui/tooltip"

import { nodes } from "./nodes"
import { Plugins } from "./plugins"

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes,
  onError: (error: Error) => {
    console.error(error)
  },
}

// Plugin to get HTML content
function HtmlExportPlugin({ onHtmlChange }: { onHtmlChange?: (html: string) => void }) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        if (onHtmlChange) {
          const html = $generateHtmlFromNodes(editor, null)
          onHtmlChange(html)
        }
      })
    })
  }, [editor, onHtmlChange])

  return null
}

// Plugin to load initial HTML content
function InitialHtmlPlugin({ initialHtml }: { initialHtml?: string }) {
  const [editor] = useLexicalComposerContext()
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    if (initialHtml && !hasLoadedRef.current) {
      hasLoadedRef.current = true

      editor.update(() => {
        // Parse HTML string to DOM
        const parser = new DOMParser()
        const dom = parser.parseFromString(initialHtml, 'text/html')

        // Generate Lexical nodes from DOM
        const nodes = $generateNodesFromDOM(editor, dom)

        // Clear existing content and insert new nodes
        const root = $getRoot()
        root.clear()
        root.append(...nodes)
      })
    }
  }, [editor, initialHtml])

  return null
}

export function Editor({
  editorState,
  editorSerializedState,
  initialHtml,
  onChange,
  onSerializedChange,
  onHtmlChange,
}: {
  editorState?: EditorState
  editorSerializedState?: SerializedEditorState
  initialHtml?: string
  onChange?: (editorState: EditorState) => void
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void
  onHtmlChange?: (html: string) => void
}) {
  return (
    <div className="bg-background overflow-hidden rounded-lg border shadow">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          ...(editorState ? { editorState } : {}),
          ...(editorSerializedState
            ? { editorState: JSON.stringify(editorSerializedState) }
            : {}),
        }}
      >
        <TooltipProvider>
          <Plugins />

          <OnChangePlugin
            ignoreSelectionChange={true}
            onChange={(editorState) => {
              onChange?.(editorState)
              onSerializedChange?.(editorState.toJSON())
            }}
          />

          <InitialHtmlPlugin initialHtml={initialHtml} />
          <HtmlExportPlugin onHtmlChange={onHtmlChange} />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  )
}
