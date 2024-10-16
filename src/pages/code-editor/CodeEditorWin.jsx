import { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import PropTypes from 'prop-types';

function ResponsiveMonacoEditor({ language = 'python', value = '// Start typing...', onChange }) {
  const editorRef = useRef(null);
  const containerRef = useRef(null); // Ref to the editor's parent container

  function handleEditorDidMount(editor) {
    editorRef.current = editor;
    editor.layout(); // Ensure initial layout
  }

  // Handle manual resizing via ResizeObserver
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (editorRef.current) {
        editorRef.current.layout(); // Manually trigger layout adjustment when parent container resizes
      }
    });

    const currentContainer = containerRef.current; // Store the current value of containerRef

    if (currentContainer) {
      observer.observe(currentContainer); // Observe the container for resizing
    }

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer); // Cleanup on unmount
      }
    };
  }, []); // Empty dependency array to ensure the effect runs once

  return (
    <div ref={containerRef} style={{ height: '100%', width: '100%' }}> {/* Wrap the editor in a resizable container */}
      <Editor
        height="100%"   // Make sure the editor takes 100% of the parent height
        width="100%"    // Make sure the editor takes 100% of the parent width
        theme="vs-dark"
        language={language}
        defaultValue={value}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          automaticLayout: false,  // Disable automatic resizing to avoid feedback loops
          minimap: { enabled: false }, // Disable the minimap
        }}
      />
    </div>
  );
}

ResponsiveMonacoEditor.propTypes = {
  language: PropTypes.string,
  value: PropTypes.string, 
  onChange: PropTypes.func.isRequired, 
};

export default ResponsiveMonacoEditor;
