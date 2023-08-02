
import { useState } from "react";

export const FormData = (formConfig: any, setFormInvalid: any, values?: any) => {
  let form: any = {} 
  if(values && typeof values == 'object') {
    Object.keys(formConfig).forEach(key => {
      if(key in values) {
        form[key] = values[key]
      }
    })
  } else form = {...formConfig}
  
  const [formValues, setFormValues] = useState({
    ...form
  });

  const replaceForm = (formConfig: any, values?: any) => { 
    let form: any = {} 
    if(values && typeof values == 'object') {
      Object.keys(formConfig).forEach(key => {
        if(key in values) {
          form[key] = values[key]
        }
      })
    } else form = {...formConfig}
    setFormValues(form)
  };

  const handleFormValueChange = (key: string, value: any) => { 
    setFormInvalid(null)
    setFormValues(
      {
        ...formValues,
        [key]: value
      }
    );
  };

  const reset = () => {
    let form: any = {} 
    if(values && typeof values == 'object') {
      Object.keys(formConfig).forEach(key => {
        if(key in values) {
          form[key] = values[key]
        }
      })
    } else form = {...formConfig}
    setFormValues(form)

    console.log('resetted', formValues)
  }

  return [
    formValues,
    handleFormValueChange,
    setFormValues,
    reset,
    replaceForm
  ]
};