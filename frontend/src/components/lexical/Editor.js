import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import editorConfig from "./editorConfig";
import "./styles.css";

import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

export default function Editor({ readOnly, onChange, children }) {
  const config = {
    ...editorConfig,
    readOnly,
    editorState: (editor) => {
      if (children) {
        const editorState = editor.parseEditorState(JSON.stringify(children));
        editor.setEditorState(editorState);
      }
      // console.log(`editorState: ${JSON.stringify(editorState)}`);
    },
  };

  return (
    <>
      <LexicalComposer initialConfig={config} children={children}>
        <div className="editor-container">
          {!readOnly && <ToolbarPlugin />}
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="editor-input" readOnly={readOnly} />
              }
              placeholder={
                <div className="editor-placeholder">Enter some text...</div>
              }
            />
            <HistoryPlugin />
            {!readOnly && <TreeViewPlugin />}
            <AutoFocusPlugin />
            <LinkPlugin />
            <ListPlugin />
            <AutoLinkPlugin />
            <CodeHighlightPlugin />
            <ListMaxIndentLevelPlugin maxDepth={7} />
            <OnChangePlugin onChange={onChange} />
          </div>
        </div>
      </LexicalComposer>
    </>
  );
}
