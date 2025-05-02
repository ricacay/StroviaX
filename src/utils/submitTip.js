export async function submitTip(destinationAccount, amountInDrops, memo = '', sender = '') {
  try {
    // Step 1: Create XRP payload via backend
    const response = await fetch('http://localhost:4000/create-tip-payload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        destination: destinationAccount,
        amount: amountInDrops,
        memo,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create tip payload.');
    }

    const data = await response.json();
    console.log('✅ Tip Payload Created:', data);

    // Step 2: Log tip metadata to backend
    const timestamp = new Date().toISOString();
    await fetch('http://localhost:4000/api/tip', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender,
        recipient: destinationAccount,
        amount: amountInDrops,
        memo,
        timestamp,
      }),
    });

    // Step 3: Redirect to signing URL
    window.open(data.next, '_blank');

    return data.uuid;
  } catch (error) {
    console.error('❌ Error submitting tip:', error);
    throw error;
  }
}
