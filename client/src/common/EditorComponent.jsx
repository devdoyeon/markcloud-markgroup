import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditorComponent = ({ content, setContent, col }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      ['link', 'image'],
      [{ align: [] }, { color: [] }, { background: [] }], // dropdown with defaults from theme
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'link',
    'image',
    'align',
    'color',
    'background',
  ];

  return (
    <>
      <ReactQuill
        theme='snow'
        modules={modules}
        formats={formats}
        value={content}
        onChange={(c, d, s, editor) =>
          setContent(prev => {
            const clone = { ...prev };
            clone[col] = editor.getHTML();
            return clone;
          })
        }
      />
    </>
  );
};
export default EditorComponent;
