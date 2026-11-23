// app/(private)/parametros/template/html-editor.tsx
'use client';

import { useEffect, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Text } from '@tiptap/extension-text';
import { Paragraph } from '@tiptap/extension-paragraph';
import { HardBreak } from '@tiptap/extension-hard-break';
import { TextStyle } from '@tiptap/extension-text-style';
import { ListItem } from '@tiptap/extension-list';
import { Dropcursor, Gapcursor, Placeholder, TrailingNode } from '@tiptap/extensions';
import { RichTextProvider } from 'reactjs-tiptap-editor';
import { Bold, RichTextBold } from 'reactjs-tiptap-editor/bold';
import { Italic, RichTextItalic } from 'reactjs-tiptap-editor/italic';
import { Button } from '@/components/ui/button';
import { Table, RichTextTable } from 'reactjs-tiptap-editor/table';
import { RichTextBubbleTable } from 'reactjs-tiptap-editor/bubble/table';
import { Code, RichTextCode } from 'reactjs-tiptap-editor/code';
import { CodeBlock, RichTextCodeBlock } from 'reactjs-tiptap-editor/codeblock';
import { RichTextBubbleCodeBlock } from 'reactjs-tiptap-editor/bubble/codeblock';
import { Link, RichTextLink } from 'reactjs-tiptap-editor/link';
import { RichTextBubbleLink } from 'reactjs-tiptap-editor/bubble/link';
import { TextAlign, RichTextAlign } from 'reactjs-tiptap-editor/textalign';
import { TextDirection, RichTextTextDirection } from 'reactjs-tiptap-editor/textdirection';
import { TextUnderline, RichTextUnderline } from 'reactjs-tiptap-editor/textunderline';
import { FontSize, RichTextFontSize } from 'reactjs-tiptap-editor/fontsize';
import { Color, RichTextColor } from 'reactjs-tiptap-editor/color';
import { CodeView, RichTextCodeView } from 'reactjs-tiptap-editor/codeview';
import { Column, ColumnNode, MultipleColumnNode, RichTextColumn } from 'reactjs-tiptap-editor/column';
import { RichTextBubbleColumns } from 'reactjs-tiptap-editor/bubble/columns';
import { Details, RichTextDetails } from 'reactjs-tiptap-editor/details';
import { ExportPdf, RichTextExportPdf } from 'reactjs-tiptap-editor/exportpdf';
import { Emoji, RichTextEmoji } from 'reactjs-tiptap-editor/emoji';
import { Heading, RichTextHeading } from 'reactjs-tiptap-editor/heading';
import { Highlight, RichTextHighlight } from 'reactjs-tiptap-editor/highlight';
import { HorizontalRule, RichTextHorizontalRule } from 'reactjs-tiptap-editor/horizontalrule';
import { Indent, RichTextIndent } from 'reactjs-tiptap-editor/indent';
import { LineHeight, RichTextLineHeight } from 'reactjs-tiptap-editor/lineheight';
import { MoreMark, RichTextMoreMark } from 'reactjs-tiptap-editor/moremark';
import { OrderedList, RichTextOrderedList } from 'reactjs-tiptap-editor/orderedlist';
import { SearchAndReplace, RichTextSearchAndReplace } from 'reactjs-tiptap-editor/searchandreplace';
import { Strike, RichTextStrike } from 'reactjs-tiptap-editor/strike';
import { TableOfContents, RichTextTableOfContents } from 'reactjs-tiptap-editor/tableofcontents';
import { TaskList, RichTextTaskList } from 'reactjs-tiptap-editor/tasklist';
import { RichTextBubbleText } from 'reactjs-tiptap-editor/bubble/text';
import { History, RichTextUndo, RichTextRedo } from 'reactjs-tiptap-editor/history';
import { Clear, RichTextClear } from 'reactjs-tiptap-editor/clear';
import { FontFamily, RichTextFontFamily } from 'reactjs-tiptap-editor/fontfamily';

import 'reactjs-tiptap-editor/style.css';

const extensions = [
    // Base
    Document,
    Text,
    Paragraph,
    HardBreak,
    TextStyle,
    ListItem,
    Dropcursor,
    Gapcursor,
    TrailingNode,
    Placeholder.configure({ placeholder: 'Escreva o corpo do e-mail...' }),
    // Recursos
    Bold,
    Italic,
    TextUnderline,
    Table,
    Code,
    CodeBlock,
    Link,
    TextAlign,
    TextDirection,
    FontSize,
    Color,
    CodeView,
    Column,
    ColumnNode,
    MultipleColumnNode,
    Details,
    ExportPdf,
    Emoji,
    Heading,
    Highlight,
    HorizontalRule,
    Indent,
    LineHeight,
    MoreMark,
    OrderedList,
    SearchAndReplace,
    Strike,
    TableOfContents,
    TaskList,
    History,
    Clear,
    FontFamily
    // adicione aqui as demais (Heading, Link, Table, ...) com o respectivo RichText* na toolbar
];

interface HtmlEditorProps {
    value: string; // conteúdo INICIAL (editor não-controlado)
    onChange: (html: string) => void;
    placeholders?: string[];
    disabled?: boolean;
}

export default function HtmlEditor({ value, onChange, placeholders = [], disabled }: HtmlEditorProps) {
    // evita recriar o editor quando o onChange muda de identidade
    const onChangeRef = useRef(onChange);
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    const editor = useEditor({
        extensions,
        content: value,
        editable: !disabled,
        immediatelyRender: false, // obrigatório no Next (SSR)
        onUpdate: ({ editor }) => onChangeRef.current(editor.getHTML()),
    });

    useEffect(() => {
        editor?.setEditable(!disabled);
    }, [editor, disabled]);

    if (!editor) {
        return <div className="h-[320px] w-full animate-pulse rounded-md bg-muted" />;
    }

    const inserir = (nome: string) => {
        editor.chain().focus().insertContent(`{{${nome}}}`).run();
    };

    return (
        <div className="space-y-2 min-w-0 max-h-">
            {placeholders.length > 0 && (
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                        Clique para inserir uma variável na posição do cursor:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {placeholders.map((p) => (
                            <Button
                                key={p}
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-xs font-mono"
                                disabled={disabled}
                                onClick={() => inserir(p)}
                            >
                                {`{{${p}}}`}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            <RichTextProvider editor={editor}>
                <div className="min-w-0 rounded-md border">
                    <div className="flex flex-wrap items-center gap-1 border-b p-1">
                        <RichTextUndo />
                        <RichTextRedo />
                        <RichTextSearchAndReplace />
                        <RichTextClear />
                        <RichTextFontFamily />
                        <RichTextHeading />
                        <RichTextFontSize />
                        <RichTextBold />
                        <RichTextItalic />
                        <RichTextUnderline />
                        <RichTextStrike />
                        <RichTextMoreMark />
                        <RichTextEmoji />
                        <RichTextColor />
                        <RichTextHighlight />
                        <RichTextOrderedList />
                        <RichTextAlign />
                        <RichTextIndent />
                        <RichTextLineHeight />
                        <RichTextTaskList />
                        <RichTextLink />
                        <RichTextCode />
                        <RichTextCodeBlock />
                        <RichTextHorizontalRule />
                        <RichTextColumn />
                        <RichTextTable />
                        <RichTextBubbleColumns />
                        <RichTextBubbleTable />
                        <RichTextBubbleCodeBlock />
                        <RichTextCodeView />
                        <RichTextExportPdf />
                        <RichTextBubbleLink />
                        <RichTextTextDirection />
                        <RichTextDetails />
                        <RichTextTableOfContents />

                    </div>
                    {/* <RichTextBubbleText className="min-w-0 rounded-md border" buttonBubble={
                        <>
                            <RichTextBold />
                            <RichTextItalic />
                        </>
                    } /> */}
                    <div className="max-h-[50vh] min-h-[280px] overflow-auto p-3">
                        <EditorContent editor={editor} />
                    </div>
                </div>
            </RichTextProvider>
        </div>
    );
}
