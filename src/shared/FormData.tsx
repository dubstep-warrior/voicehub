
import { useState } from "react";

export const FormData = (values: any, setFormInvalid: any) => {
  const [formValues, setFormValues] = useState({
    ...values
  });

  const handleFormValueChange = (key: string, value: any) => {
    setFormInvalid(false)
    setFormValues(
      {
        ...formValues,
        [key]: value
      }
    );
  };

  return [
    formValues,
    handleFormValueChange,
    setFormValues,
  ]
};