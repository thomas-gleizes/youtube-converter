import { useState } from "react";

const useValues = (initialValues) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (event) => {
    if (typeof initialValues === "object") {
      values[event.target.name] = event.target.value;
      setValues({ ...values });
    } else {
      setValues(event.target.value);
    }
  };

  return [values, handleChange];
};

export default useValues;
