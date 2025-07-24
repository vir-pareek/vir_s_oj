import Editor from "@monaco-editor/react";

const EditorComponent = ({ value, onValueChange, language }) => {
    return (
      <Editor
        height="400px"
        language={language}
        defaultValue="// Write your code here"
        theme="vs-dark"
        value={value}
        onChange={(value) => onValueChange(value || "")}
      />
    );
}
export default EditorComponent;