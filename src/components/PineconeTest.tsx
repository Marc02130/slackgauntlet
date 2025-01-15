'use client';

import { useState } from 'react';

export function PineconeTest() {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTest = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/test/pinecone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Failed to test Pinecone connection');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Test Pinecone Connection</h2>
      
      <div className="space-y-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter test message"
          className="w-full p-2 border rounded"
        />
        
        <button
          onClick={handleTest}
          disabled={isLoading || !message}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Connection'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-500 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="p-4 bg-gray-50 rounded">
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 