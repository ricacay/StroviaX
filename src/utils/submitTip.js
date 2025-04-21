export default async function submitTip({ tipper, amount }) {
    console.log(`Submitting tip from ${tipper} of ${amount} XRP`);
    return Promise.resolve(true);
  }
  