import { PromptTemplate } from '@langchain/core/prompts';
import { createProofreadPrompt } from '../prompts';

describe('Prompt Utilities', () => {
  it('should create valid prompt template with escaped JSON', () => {
    const template = createProofreadPrompt(
      'Test prompt {var}',
      '{"key": "value"}'
    );
    
    expect(() => {
      PromptTemplate.fromTemplate(template);
    }).not.toThrow();
  });
}); 