import { useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import EditorComponent from './common/EditorComponent';
import useInput from './Hooks/useInput';

function App() {
  const [desc, setDesc] = useState("");
  const curdata = useInput("");
  const onEditorChange = (value) => {
    setDesc(value)
  }
  console.log(desc)
  return (
    <>
    <h1>그룹웨어 작업 준비</h1>
    <input type="text" {...curdata} />
    {console.log(curdata)}
    <EditorComponent value={desc} onChange={onEditorChange}/>
    </>
  );
}

export default App;
