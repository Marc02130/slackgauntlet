type APIResponse<T> = {
  data?: T;
  error?: string;
};

export const apiClient = {
  async put<T>(url: string, data: any): Promise<APIResponse<T>> {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Request failed');
      }

      return { data: responseData };
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}; 