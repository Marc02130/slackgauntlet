import React, { useState } from 'react';

interface UseFormSubmitOptions<T> {
  onSubmit: (data: T) => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useFormSubmit<T>({ onSubmit, onSuccess, onError }: UseFormSubmitOptions<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: T) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(data);
      onSuccess?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Submission failed');
      setError(error.message);
      onError?.(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    error,
    handleSubmit
  };
} 