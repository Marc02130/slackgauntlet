export function escapeJsonTemplate(json: string): string {
  return json.replace(/{/g, '{{').replace(/}/g, '}}');
}

export function createProofreadPrompt(template: string, jsonExample: string): string {
  const escapedJson = escapeJsonTemplate(jsonExample);
  return `${template}\n\nExpected JSON format:\n${escapedJson}`;
} 