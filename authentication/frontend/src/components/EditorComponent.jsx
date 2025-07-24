import Editor from "@monaco-editor/react";

const EditorComponent = ()=> {
    return (
        <Editor
        height="400px"
        defaultLanguage="cpp"
        defaultValue="// Write your code here"
        theme="vs-dark"
        />
    );
}
export default EditorComponent;