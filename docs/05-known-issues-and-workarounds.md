# Known Issues + Workarounds

| Issue | Description | Workaround |
|-------|-------------|------------|
| `auth.resolve` is undefined | Xumm SDK isn’t fully ready | Delay with polling + checks |
| Crashes on Vercel SSR | Server tries to access `window` | Add `typeof window` guards |
| Logout doesn’t reset UI | State not flushed | Call `window.location.reload()` |
| No mobile fallback | QR-only login is confusing | Add instruction UI (TBD) |
