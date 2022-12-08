import { useState } from 'react';

const useInput = initValue => {
  // 사용법 const inputAgree = useInput(false);
  const [value, setValue] = useState(initValue);

  const onChange = e => {
    setValue(e.target.value);
  };

  return { value, onChange, setValue };
};

export default useInput;
