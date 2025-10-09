import { useEffect, useCallback } from "react";

export const GoogleSocialLogin = () => {
  // Use a fallback client ID for development
  const clientId =
    process.env.REACT_APP_GOOGLE_CLIENT_ID || "your-google-client-id";

  const handleCredentialResponse = useCallback((response: any) => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get("redirect_url");
    const action = urlParams.get("action");

    if (redirectUrl) {
      const redirectUrlWithToken = new URL(redirectUrl);

      if (action === "addEmailAccount") {
        const isCrm = urlParams.get("isCrm");
        redirectUrlWithToken.searchParams.append("credential", response.code);
        redirectUrlWithToken.searchParams.append("isCrm", isCrm ?? "false");
        // commit
        window.location.href = redirectUrlWithToken.toString();
      }
    } else {
      console.log("Encoded JWT ID token:", response.code);
      // No redirect URL provided, handle token locally
    }
  }, []);

  const getAuthCode = useCallback(() => {
    if (!(window as any)?.google) return;

    (window as any).google.accounts.oauth2
      .initCodeClient({
        client_id: clientId,
        scope: "https://mail.google.com email profile",
        ux_mode: "popup",
        access_type: "offline",
        callback: (response: any) => {
          // Send this authCode to your backend to exchange for tokens
          console.log("token", response.code);
          handleCredentialResponse(response);
          // handleToken(response.code);
        },
      })
      .requestCode();
  }, [clientId]);
  // const getAuthCode = useCallback(() => {
  //   // Use direct redirect approach instead of popup to avoid blocking
  //   const redirectUri = `${window.location.origin}/oauth/google/callback`;
  //   const scope = encodeURIComponent("https://mail.google.com email profile");

  //   const authUrl =
  //     `https://accounts.google.com/o/oauth2/v2/auth?` +
  //     `client_id=${clientId}&` +
  //     `redirect_uri=${encodeURIComponent("http:localhost:5500")}&` +
  //     `scope=${scope}&` +
  //     `response_type=code&` +
  //     `access_type=offline&` +
  //     `prompt=consent`;

  //   // Redirect to Google OAuth
  //   window.location.href = authUrl;
  // }, [clientId]);

  useEffect(() => {
    // Load the Google API library
    const loadGsiScript = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleClient;
      document.body.appendChild(script);
    };

    const initializeGoogleClient = () => {
      if (!(window as any).google) return;

      console.log("initialized");
      (window as any).google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });

      // Automatically initiate OAuth flow once Google client is initialized
      getAuthCode();
    };

    loadGsiScript();
  }, [clientId, handleCredentialResponse, getAuthCode]);

  // No UI - just return null or a minimal loading indicator
  return null;
  return (
    <div>
      <button
        onClick={() => {
          console.log(clientId);
          getAuthCode();
        }}
      >
        Login with Google
      </button>
    </div>
  );
};

export default GoogleSocialLogin;
