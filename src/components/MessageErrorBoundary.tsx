import { ErrorBoundary } from 'react-error-boundary';
import { logger } from '@/lib/utils/logger';

export function MessageErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallbackRender={({ error }) => (
        <div className="p-4 text-red-500 bg-red-50 rounded-md">
          <h3 className="font-medium">Failed to send message</h3>
          <p className="text-sm">{error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-blue-500 hover:underline"
          >
            Try again
          </button>
        </div>
      )}
      onError={(error) => {
        logger.error('MessageError', error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
} 