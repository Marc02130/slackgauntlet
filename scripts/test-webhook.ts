const testWebhook = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/webhooks/clerk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'svix-id': 'test-id',
        'svix-timestamp': new Date().toISOString(),
        'svix-signature': 'test-signature'
      },
      body: JSON.stringify({
        type: 'user.created',
        data: {
          id: 'test-user-id',
          email_addresses: [{ email_address: 'test@example.com' }],
          username: 'testuser',
          first_name: 'Test',
          last_name: 'User',
          profile_image_url: 'https://example.com/image.jpg'
        }
      })
    });
    console.log('Response:', await response.text());
  } catch (error) {
    console.error('Error:', error);
  }
};

testWebhook(); 