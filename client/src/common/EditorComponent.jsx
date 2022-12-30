import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

class EditorComponent extends Component {
  constructor(props) {
    super(props);
  }

  modules = {
    toolbar: [
      //[{ 'font': [] }],
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      ['link', 'image'],
      [{ align: [] }, { color: [] }, { background: [] }], // dropdown with defaults from theme
      ['clean'],
    ],
  };

  formats = [
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

  render() {
    const { content, setContent, col } = this.props;
    return (
      <>
        <ReactQuill
          theme='snow'
          modules={this.modules}
          formats={this.formats}
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
  }
}
export default EditorComponent;
