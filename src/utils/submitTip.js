export async function submitTip(destinationAccount, amountInDrops, memo = '') {
  try {
    const response = await fetch('http://localhost:4000/create-tip-payload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        destination: destinationAccount,
        amount: amountInDrops,
        memo: memo,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create tip payload.');
    }

    const data = await response.json();
    console.log('✅ Tip Payload Created:', data);

    // Now redirect user to the signing URL
    window.open(data.next, '_blank');

    return data.uuid;
  } catch (error) {
    console.error('❌ Error submitting tip:', error);
    throw error;
  }
}
