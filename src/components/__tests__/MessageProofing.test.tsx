import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MessageInput } from '../MessageInput';
import { MessageProofingDialog } from '../MessageProofingDialog';

describe('Message Proofing', () => {
  it('shows proofing button when message is not empty', () => {
    render(<MessageInput />);
    const input = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(input, { target: { value: 'test message' } });
    expect(screen.getByRole('button', { name: /proofread/i })).toBeEnabled();
  });

  it('displays proofing dialog with suggestions', () => {
    const props = {
      isOpen: true,
      onClose: jest.fn(),
      original: 'Hello wrold',
      suggested: 'Hello world',
      changes: [{
        type: 'modification',
        original: 'wrold',
        suggested: 'world',
        position: [6, 11]
      }],
      onAccept: jest.fn(),
      onReject: jest.fn()
    };

    render(<MessageProofingDialog {...props} />);
    expect(screen.getByText('Review Changes')).toBeInTheDocument();
    expect(screen.getByText('wrold')).toHaveClass('bg-red-100');
    expect(screen.getByText('world')).toHaveClass('bg-green-100');
  });
}); 