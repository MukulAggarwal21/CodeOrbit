// eslint-disable-next-line react/prop-types
const FileTreeNode = ({ fileName, nodes, onSelect, path }) => {
    const isDir = !!nodes
    return (
        <div onClick={(e) => {
            e.stopPropagation()
            if (isDir) return;
            onSelect(path)
        }} style={{ marginLeft: '10px' }}>
            <p className={isDir ? "file-node " : " "}>{fileName}</p>
            {fileName}
            {nodes &&  fileName!= 'node_modules' && (
                <ul >
                    {Object.keys(nodes).map((child) => (
                        <li key={child}>
                            <FileTreeNode
                            onSelect={onSelect}
                                path={path + '/' + child}
                                fileName={child}
                                nodes={nodes[child]}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}


// eslint-disable-next-line react/prop-types
const FileTree = ({ tree , onSelect }) => {
    console.log(tree);
    return (
        <FileTreeNode
        onSelect={onSelect}
            fileName="/" path=""
            nodes={tree}

        />
    )
}

export default FileTree; 