// src/hooks/useXamanAuth.js

import { useEffect, useState } from 'react'
import { XummPkce } from 'xumm-oauth2-pkce'

const apiKey = import.meta.env.VITE_XUMM_API_KEY
let xumm = null

if (apiKey) {
  try {
    xumm = new XummPkce(apiKey)
  } catch (err) {
    console.error('❌ Xumm initialization failed:', err)
  }
} else {
  console.error('❌ Missing VITE_XUMM_API_KEY in .env')
}

export default function useXamanAuth() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!xumm || typeof xumm.on !== 'function') {
      console.warn('🚫 Xumm is not properly initialized.')
      return
    }

    const handleSuccess = async () => {
      try {
        const state = await xumm.state?.()
        if (state?.me?.sub) {
          setUser({
            wallet: state.me.sub,
            name: state.me.name || 'XRP User',
          })
        }
      } catch (err) {
        console.error('❌ Error fetching xumm state in success handler:', err)
      }
    }

    const handleLogout = () => setUser(null)

    try {
      xumm.on('success', handleSuccess)
      xumm.on('logout', handleLogout)

      // Check session on mount
      xumm.state?.().then((state) => {
        if (state?.me?.sub) {
          setUser({
            wallet: state.me.sub,
            name: state.me.name || 'XRP User',
          })
        }
      }).catch(err => {
        console.warn('⚠️ Silent fail during initial state check:', err)
      })

    } catch (err) {
      console.error('❌ Listener setup failed:', err)
    }

    return () => {
      try {
        xumm?.removeAllListeners?.()
      } catch (err) {
        console.warn('⚠️ Failed to remove listeners:', err)
      }
    }
  }, [])

  const login = () => {
    if (!xumm || typeof xumm.authorize !== 'function') {
      console.error('❌ Cannot authorize — xumm not available')
      return
    }
    xumm.authorize()
  }

  const logout = () => {
    if (!xumm) return
    xumm.logout()
  }

  return { user, login, logout, xumm }
}
