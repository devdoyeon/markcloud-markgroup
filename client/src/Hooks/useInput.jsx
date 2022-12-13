import { useState } from 'react';

const useInput = initValue => {
  // 사용법 const inputAgree = useInput(false);
  const [value, setvalue] = useState(initValue);

  const onChange = e => {
    setvalue(e.target.value);
  };

  return { value, onChange, setvalue };
};

export default useInput;
