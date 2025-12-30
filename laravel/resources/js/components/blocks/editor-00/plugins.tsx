import { useState, useCallback, useEffect } from "react"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  $createParagraphNode,
  $getNodeByKey,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_CRITICAL
} from "lexical"
import {
  $createHeadingNode,
  $isHeadingNode,
  HeadingTagType,
  $createQuoteNode,
  $isQuoteNode
} from "@lexical/rich-text"
import { $getNearestNodeOfType } from "@lexical/utils"
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  Quote
} from "lucide-react"

import { ContentEditable } from "@/components/editor/editor-ui/content-editable"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [blockType, setBlockType] = useState<string>('paragraph')

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))

      // Check block type
      const anchorNode = selection.anchor.getNode()
      const element = anchorNode.getKey() === 'root'
        ? anchorNode
        : anchorNode.getTopLevelElementOrThrow()

      if ($isHeadingNode(element)) {
        const tag = element.getTag()
        setBlockType(tag)
      } else if ($isQuoteNode(element)) {
        setBlockType('quote')
      } else {
        setBlockType('paragraph')
      }
    }
  }, [])

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar()
        return false
      },
      COMMAND_PRIORITY_CRITICAL
    )
  }, [editor, updateToolbar])

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar()
      })
    })
  }, [editor, updateToolbar])

  const formatHeading = (headingType: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        // Get the anchor node and find its top-level parent
        const anchorNode = selection.anchor.getNode()
        const element = anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow()

        // Check if already this heading type
        if ($isHeadingNode(element) && element.getTag() === headingType) {
          // Toggle off - convert back to paragraph
          const paragraph = $createParagraphNode()
          element.replace(paragraph)
          paragraph.select()
        } else {
          // Convert to heading
          const heading = $createHeadingNode(headingType)
          element.replace(heading)
          heading.select()
        }
      }
    })
  }

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode()
        const element = anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow()

        if (element.getType() !== 'paragraph') {
          const paragraph = $createParagraphNode()
          element.replace(paragraph)
          paragraph.select()
        }
      }
    })
  }

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode()
        const element = anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow()

        if ($isQuoteNode(element)) {
          // Toggle off - convert back to paragraph
          const paragraph = $createParagraphNode()
          element.replace(paragraph)
          paragraph.select()
        } else {
          // Convert to quote
          const quote = $createQuoteNode()
          element.replace(quote)
          quote.select()
        }
      }
    })
  }

  return (
    <div className="flex items-center gap-1 px-2 py-2 border-b bg-muted/30">
      {/* Text Format */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isBold ? "secondary" : "ghost"}
            size="sm"
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
            className="h-8 w-8 p-0"
          >
            <Bold className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Bold (Ctrl+B)</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isItalic ? "secondary" : "ghost"}
            size="sm"
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
            className="h-8 w-8 p-0"
          >
            <Italic className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Italic (Ctrl+I)</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isUnderline ? "secondary" : "ghost"}
            size="sm"
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
            className="h-8 w-8 p-0"
          >
            <Underline className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Underline (Ctrl+U)</TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Block Format */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={blockType === 'paragraph' ? "secondary" : "ghost"}
            size="sm"
            onClick={formatParagraph}
            className="h-8 w-8 p-0"
          >
            <Pilcrow className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Paragraph</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={blockType === 'h1' ? "secondary" : "ghost"}
            size="sm"
            onClick={() => formatHeading('h1')}
            className="h-8 w-8 p-0"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Heading 1</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={blockType === 'h2' ? "secondary" : "ghost"}
            size="sm"
            onClick={() => formatHeading('h2')}
            className="h-8 w-8 p-0"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Heading 2</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={blockType === 'h3' ? "secondary" : "ghost"}
            size="sm"
            onClick={() => formatHeading('h3')}
            className="h-8 w-8 p-0"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Heading 3</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={blockType === 'quote' ? "secondary" : "ghost"}
            size="sm"
            onClick={formatQuote}
            className="h-8 w-8 p-0"
          >
            <Quote className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Quote</TooltipContent>
      </Tooltip>
    </div>
  )
}

export function Plugins() {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null)

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  return (
    <div className="relative">
      {/* Toolbar */}
      <ToolbarPlugin />

      {/* Editor Content */}
      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <div className="">
              <div className="" ref={onRef}>
                <ContentEditable placeholder={"Tulis konten artikel Anda di sini..."} />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
      </div>
    </div>
  )
}
