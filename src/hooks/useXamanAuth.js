import { useEffect, useState } from 'react';
import { XummPkce } from 'xumm-oauth2-pkce';

const xumm = new XummPkce({
  clientId: import.meta.env.VITE_XUMM_API_KEY, // using your existing API Key
  redirectUri: window.location.origin          // e.g., http://localhost:5173
});

export function useXamanAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const login = async () => {
      try {
        await xumm.authorize();

        if (xumm.state?.me) {
          setIsAuthenticated(true);
          setUserToken(xumm.state.me.sub);
          setUserData(xumm.state.me);
        } else {
          console.warn('User declined or not fully authenticated.');
        }
      } catch (error) {
        console.error('Xumm OAuth2 login failed:', error);
      } finally {
        setLoading(false);
      }
    };

    login();
  }, []);

  return {
    isAuthenticated,
    userToken,
    userData,
    loading,
    xumm
  };
}
