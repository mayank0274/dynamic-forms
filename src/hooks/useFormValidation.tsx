import { useState } from "react";

type Props = {
  initialValues: any;
  validationSchema: any;
};

const useFormValidation = ({ initialValues, validationSchema }: Props) => {
  const [formData, setFormData] = useState<any>(initialValues);
  const [errors, setErrors] = useState({ issues: [] });

  const handleInputChange = (event: any) => {
    let isNumeric = Number.isInteger(parseInt(event.target.value));
    setFormData({
      ...formData,
      [event.target.name]:
        isNumeric && event.target.type != "datetime-local"
          ? parseInt(event.target.value)
          : event.target.value,
    });
  };

  const validateForm = () => {
    const validate = validationSchema.safeParse(formData);

    if (!validate.success) {
      setErrors(validate.error);
      return false;
    } else {
      setErrors({ issues: [] });
      return true;
    }
  };

  const handleSubmit = (onSubmit: any) => (event: any) => {
    event.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      onSubmit(formData);
    }
  };

  return { formData, errors, handleInputChange, handleSubmit, setFormData };
};

export default useFormValidation;
