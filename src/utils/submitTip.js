// src/utils/submitTip.js

/**
 * Submit a tip using the active XUMM session
 * @param {Object} xumm - XummPkce instance from useXamanAuth
 * @param {string} destinationAccount - Creator's XRP wallet address
 * @param {string} amount - Amount in drops (1 XRP = 1,000,000 drops)
 * @param {string} memo - Optional message/memo
 * @returns {Promise<void>}
 */
export async function submitTip(xumm, destinationAccount, amount, memo = '') {
  try {
    const payload = {
      txjson: {
        TransactionType: 'Payment',
        Destination: destinationAccount,
        Amount: amount.toString(),
        Memos: memo
          ? [
              {
                Memo: {
                  MemoData: Buffer.from(memo, 'utf8').toString('hex'),
                },
              },
            ]
          : undefined,
      },
    }

    const { created } = await xumm.payload.createAndSubscribe(payload, (event) => {
      if (event.data.signed === true) {
        console.log('✅ Transaction signed by user.')
      } else if (event.data.signed === false) {
        console.warn('❌ User declined the transaction.')
      }
    })

    if (created?.next?.always) {
      // Open sign request in new tab
      window.open(created.next.always, '_blank')
    }
  } catch (error) {
    console.error('❌ Error submitting tip:', error)
    throw error
  }
}
