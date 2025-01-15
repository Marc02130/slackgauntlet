'use client';

import { useState, useEffect } from 'react';
import { theme } from '@/lib/theme';

interface AIProofingSettings {
  proofBeforeSend: boolean;
  proofAfterSend: boolean;
  autoAcceptChanges: boolean;
  checkGrammar: boolean;
  checkTone: boolean;
  checkClarity: boolean;
  checkSensitivity: boolean;
  preferredTone?: string;
  formality: number;
}

export function AIProofingSettings({
  onSaveSuccess,
}: {
  onSaveSuccess?: () => void;
}) {
  const [settings, setSettings] = useState<AIProofingSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [savedSettings, setSavedSettings] = useState<AIProofingSettings | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      console.log('Fetching AI proofing settings...');
      const response = await fetch('/api/users/me/proofing-settings');
      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch settings');
      }
      const data = await response.json();
      console.log('Settings data:', data);
      setSettings({
        proofBeforeSend: data.proofBeforeSend ?? false,
        proofAfterSend: data.proofAfterSend ?? false,
        autoAcceptChanges: data.autoAcceptChanges ?? false,
        checkGrammar: data.checkGrammar ?? true,
        checkTone: data.checkTone ?? true,
        checkClarity: data.checkClarity ?? true,
        checkSensitivity: data.checkSensitivity ?? true,
        preferredTone: data.preferredTone ?? 'professional',
        formality: data.formality ?? 5
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      setError(error instanceof Error ? error.message : 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = async (changes: Partial<AIProofingSettings>) => {
    const updatedSettings = { ...settings, ...changes };
    setSettings(updatedSettings);
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError('');
      
      if (!settings) {
        throw new Error('No settings to save');
      }

      const response = await fetch('/api/users/me/proofing-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update settings');
      }

      const savedData = await response.json();
      setSavedSettings(settings);
      setIsDirty(false);
      console.log('Settings saved successfully:', savedData);
      onSaveSuccess?.();
    } catch (error) {
      console.error('Error saving settings:', error);
      setError(error instanceof Error ? error.message : 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div>Loading settings...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!settings) return null;

  return (
    <div className={`space-y-6 p-4 ${theme.colors.primary.text}`}>
      <h2 className="text-lg font-semibold">AI Proofing Settings</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.proofBeforeSend}
              onChange={(e) => handleChange({ proofBeforeSend: e.target.checked })}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <span>Proof messages before sending</span>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.proofAfterSend}
              onChange={(e) => handleChange({ proofAfterSend: e.target.checked })}
              className="rounded border-gray-300"
            />
            <span>Proof messages after sending</span>
          </label>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Proofing Options</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'checkGrammar', label: 'Grammar' },
              { key: 'checkTone', label: 'Tone' },
              { key: 'checkClarity', label: 'Clarity' },
              { key: 'checkSensitivity', label: 'Sensitivity' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings[key as keyof AIProofingSettings] as boolean}
                  onChange={(e) => handleChange({ [key]: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block">
            <span className="font-medium text-gray-700">Preferred Tone</span>
            <select
              value={settings.preferredTone || ''}
              onChange={(e) => handleChange({ preferredTone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-800"
            >
              <option value="">Default</option>
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="friendly">Friendly</option>
            </select>
          </label>
        </div>

        <div className="space-y-2">
          <label className="block">
            <span className="font-medium">Formality Level (1-10)</span>
            <input
              type="range"
              min="1"
              max="10"
              value={settings.formality}
              onChange={(e) => handleChange({ formality: parseInt(e.target.value) })}
              className="mt-1 block w-full"
            />
            <div className="text-sm text-gray-500 text-center">
              {settings.formality}
            </div>
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <button
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          className={`px-4 py-2 rounded-md ${
            isDirty
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-500'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
} 