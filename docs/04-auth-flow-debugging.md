# Debugging Wallet Login Flow

## Common Issues
- Login window closes = no session saved
- `xumm` instance reused across routes
- `logout()` doesn’t clean state

## Debug Tips
- Add console logs to `xumm.on('success')` and `xumm.state()`
- Reset session with `await xumm.logout()` before re-auth
- Only init Xumm if on a wallet-enabled route
