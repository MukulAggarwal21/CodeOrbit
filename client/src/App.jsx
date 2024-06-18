import { useCallback, useEffect, useState } from 'react'
import './App.css'
import Terminal from './components/terminal'
import FileTree from './components/tree'
import socket from './socket'
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

function App() {

  const [fileTree, setFileTree] = useState({})
  const [selectedFile, setSelectedFile] = useState("");
  const [SelectedFileContent, setSelectedFileContent] = useState(" ");
  const [code, setcode] = useState('');

  const isSaved = setSelectedFileContent === code ; 

  const getFileTree = async () => {
    const response = await fetch('http://localhost:9000/files')
    const result = await response.json();
    setFileTree(result.tree);
  };

  // useEffect(() => {
  //   getFileTree()
  // }, [])

  useEffect(() => {
    socket.on('file:refresh', getFileTree)
    return () => {
      socket.off('file:refresh', getFileTree);
    };
  }, []);


  const getFileContents = useCallback(async () => {
    if (!selectedFile) return;
    const response = await fetch(`http://localhost:9000/files/content?path=${selectedFile}`);
    const result = await response.json();
    setSelectedFileContent(result.content)

  }, [selectedFile]);

  useEffect(() => {
    if (selectedFile && SelectedFileContent) {
      setcode(SelectedFileContent)
    }
  }, [selectedFile, SelectedFileContent])


  useEffect(() => {
    if (selectedFile) getFileContents();
  }, [getFileContents, selectedFile])



  useEffect(() => {
    if (code && !isSaved) {
      const timer = setTimeout(() => {
        socket.emit("file:change", {
          path: selectedFile,
          content: code,
        })
      }, 5000);
      return () => {
        clearTimeout(timer)
      }
    }
  }, [code, selectedFile, isSaved])

  useEffect(() => {
    setcode("");
  }, [selectedFile]);

  return (
    <div className=' playground-container' >
      <div className='editor-container'>
        <div className='files'>
          <FileTree onSelect={(path) => setSelectedFile(path)} tree={fileTree} />
        </div>
        <div className="editor">
          {selectedFile && <p>{selectedFile.replaceAll('/', '>')} {isSaved ? "Saved ": 'UnSaved'}</p>}
          {/* ace.config.set('basePath', '/path-to-ace-builds/src-noconflict'); */}

          <AceEditor
            value={code}
            onChange={e => setcode(e)}
            mode="javascript" // Ensure the mode matches the imported mode
            theme="github"    // Ensure the theme matches the imported theme
            name="UNIQUE_ID_OF_DIV" // Optional, but recommended
            editorProps={{ $blockScrolling: true }}
          />
        </div>
      </div>
      <div className='terminal-container '>
        <Terminal />
      </div>
    </div>

  )
}

export default App
