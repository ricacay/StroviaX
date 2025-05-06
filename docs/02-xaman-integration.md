# Xaman Integration (XUMM SDK)

StroviaX uses `xumm-oauth2-pkce` to provide secure OAuth2 wallet login.

## Why Xaman?
- Direct XRP Ledger access for user-owned funds
- QR code login and mobile approval
- Persistent login session

## Integration Notes
- Do not call `xumm.auth.resolve()` directly inside `on('success')`
- Always verify `xumm.auth?.resolve` is defined (or wrap in a polling retry)
- SSR/CSR race conditions WILL crash the app without guards

See [Fixing SSR Crashes](./03-ssr-crash-fixes.md).

