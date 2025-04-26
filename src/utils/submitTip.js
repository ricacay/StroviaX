export async function submitTip(xumm, destinationAccount, amountInDrops, memo = '') {
  try {
    const payload = {
      TransactionType: 'Payment',
      Destination: destinationAccount,
      Amount: amountInDrops,
      Memos: memo
        ? [
            {
              Memo: {
                MemoData: [...new TextEncoder().encode(memo)]
                  .map(b => b.toString(16).padStart(2, '0'))
                  .join('')
                  .toUpperCase(),
              },
            },
          ]
        : undefined,
    };

    // Await result, store it before destructuring
    const result = await xumm.payload?.createAndSubscribe(payload, (event) => {
      if (event.data.signed === true) {
        console.log('✅ Transaction signed by user.');
        return event.data;
      } else if (event.data.signed === false) {
        console.warn('❌ User declined the transaction.');
        throw new Error('User declined signing.');
      }
    });

    // Now check result before destructuring
    if (!result || !result.resolved?.signed) {
      throw new Error('User did not complete signing.');
    }

    console.log('✅ Tip successfully submitted.');
  } catch (error) {
    console.error('❌ Error submitting tip:', error);
    throw error;
  }
}
