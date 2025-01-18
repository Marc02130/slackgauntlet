'use client';

import { useState, useEffect, useRef } from 'react';
import { logger } from '@/lib/utils/logger';
import { Upload, X } from 'lucide-react';
import { useUploadThing } from "@/lib/hooks/useUploadThing";

interface Avatar {
  id: string;
  name: string;
  description: string;
  personality: string;
  contextLimit: number;
  temperature: number;
  documents: Array<{
    id: string;
    name: string;
    content: string;
    fileUrl?: string;
  }>;
}

export function AvatarConfig({ avatarId }: { avatarId?: string }) {
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { startUpload } = useUploadThing("avatarDocument");

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!avatarId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/avatars/${avatarId}`);
        if (!response.ok) throw new Error('Failed to fetch avatar');
        const data = await response.json();
        setAvatar(data);
      } catch (err) {
        logger.error('AvatarConfig', 'Failed to fetch avatar', { error: err });
        setError('Failed to load avatar settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvatar();
  }, [avatarId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!avatar || isSaving) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/avatars/${avatarId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(avatar)
      });

      if (!response.ok) throw new Error('Failed to update avatar');
      
      // Optionally refresh data
      const updated = await response.json();
      setAvatar(updated);
    } catch (err) {
      setError('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || !avatar) return;
      
      setIsUploading(true);
      const files = Array.from(e.target.files);
      
      // Upload files to UploadThing
      const uploadResult = await startUpload(files);
      if (!uploadResult) {
        throw new Error("Failed to upload files");
      }

      // Create documents in database
      const response = await fetch('/api/avatars/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avatarId: avatar.id,
          documents: uploadResult.map(file => ({
            name: file.name,
            fileUrl: file.url
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create documents');
      }

      // Fetch updated avatar data to refresh the documents list
      const updatedAvatarResponse = await fetch(`/api/avatars/${avatar.id}`);
      if (!updatedAvatarResponse.ok) {
        throw new Error('Failed to fetch updated avatar data');
      }
      const updatedAvatar = await updatedAvatarResponse.json();
      setAvatar(updatedAvatar);

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading documents:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload documents');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      const response = await fetch(`/api/avatars/documents/${documentId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      // Update local state
      setAvatar(prev => prev ? {
        ...prev,
        documents: prev.documents.filter(doc => doc.id !== documentId)
      } : null);
    } catch (err) {
      setError('Failed to delete document');
      logger.error('AvatarConfig', 'Document deletion failed', { error: err });
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!avatar) {
    return <div className="p-4">No avatar found</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{avatar.name}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={avatar.name}
              onChange={e => setAvatar({ ...avatar, name: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={avatar.description}
              onChange={e => setAvatar({ ...avatar, description: e.target.value })}
              className="w-full p-2 border rounded-md"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Personality</label>
            <input
              type="text"
              value={avatar.personality}
              onChange={e => setAvatar({ ...avatar, personality: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Context Limit</label>
            <input
              type="number"
              value={avatar.contextLimit}
              onChange={e => setAvatar({ ...avatar, contextLimit: parseInt(e.target.value) })}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Temperature</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="1"
              value={avatar.temperature}
              onChange={e => setAvatar({ ...avatar, temperature: parseFloat(e.target.value) })}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Knowledge Base</h2>
        
        <div className="mb-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <Upload size={20} />
            Upload Documents
          </button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            multiple
            accept=".txt,.pdf,.doc,.docx"
          />
        </div>

        <div className="space-y-2">
          {(avatar?.documents ?? []).length === 0 && (
            <p className="text-gray-500">No documents uploaded yet</p>
          )}
          
          {(avatar?.documents ?? []).map(doc => (
            <div 
              key={doc.id} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <span>{doc.name}</span>
              <button
                onClick={() => handleDeleteDocument(doc.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 