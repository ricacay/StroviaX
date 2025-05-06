# Fixing SSR & Hydration Crashes

## Problem
Using `xumm.auth.resolve()` too early (during SSR or before SDK is initialized) leads to:

```
Cannot read properties of undefined (reading 'resolve')
```

## Fix Strategy

### ✅ Step 1: Guard Hook Execution
In `useXamanAuth.js`:

```js
if (typeof window === 'undefined') return { ... };
```

### ✅ Step 2: Use `useEffect(() => setMounted(true))`
Only call wallet hooks after component has mounted.

### ✅ Step 3: Move resolve logic into polling loop
```js
useEffect(() => {
  const interval = setInterval(() => {
    if (xumm.auth?.resolve) {
      xumm.auth.resolve().then(...);
      clearInterval(interval);
    }
  }, 500);
}, []);
```

