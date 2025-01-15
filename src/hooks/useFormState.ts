import { useState } from 'react';

export function useFormState<T>(initialState: T) {
  const [data, setData] = useState(initialState);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (changes: Partial<T>) => {
    setData(prev => ({ ...prev, ...changes }));
    setIsDirty(true);
  };

  const resetForm = () => {
    setData(initialState);
    setIsDirty(false);
    setError('');
  };

  return {
    data,
    isDirty,
    isSaving,
    error,
    setIsSaving,
    setError,
    handleChange,
    resetForm
  };
} 