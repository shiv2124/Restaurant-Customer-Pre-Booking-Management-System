import { useState } from 'react';

/**
 * Controlled-form state + validation.
 *
 *   const form = useForm({ initialValues, validate });
 *   <FormField label="Email" {...form.getFieldProps('email')} />
 *   <form onSubmit={form.handleSubmit(values => ...)} noValidate>
 *
 * - `validate(values)` is a pure function returning { fieldName: 'message' }.
 * - Errors are derived from the current values on every render (no separate
 *   error state to keep in sync).
 * - A field's error is only shown after the user has left it (blur) or tried
 *   to submit, so nobody is shouted at while still typing their first letter.
 */
export default function useForm({ initialValues, validate }) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});

  const errors = validate(values);
  const isValid = Object.keys(errors).length === 0;

  const setFieldValue = (name, value) =>
    setValues((current) => ({ ...current, [name]: value }));

  const touch = (name) =>
    setTouched((current) => (current[name] ? current : { ...current, [name]: true }));

  const getFieldProps = (name) => ({
    name,
    value: values[name],
    error: touched[name] ? errors[name] : undefined,
    onChange: (event) => setFieldValue(name, event.target.value),
    onBlur: () => touch(name),
  });

  const handleSubmit = (onValid) => (event) => {
    event.preventDefault();
    // Reveal every error at once, then stop if there are any.
    setTouched(Object.fromEntries(Object.keys(values).map((key) => [key, true])));
    if (isValid) onValid(values);
  };

  const reset = (nextValues = initialValues) => {
    setValues(nextValues);
    setTouched({});
  };

  return { values, errors, isValid, setFieldValue, getFieldProps, handleSubmit, reset };
}
