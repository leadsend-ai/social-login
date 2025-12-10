import { useCallback, useEffect } from "react";

export const GoogleSocialConnect = () => {
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
      } else if (action === "addCalendar") {
        redirectUrlWithToken.searchParams.append("credential", response.code);
        redirectUrlWithToken.searchParams.append("addCalendar", "true");
        window.location.href = redirectUrlWithToken.toString();
      }
    } else {
      console.log("Encoded JWT ID token:", response.code);
      // No redirect URL provided, handle token locally
    }
  }, []);

  const getAuthCode = useCallback(() => {
    if (!(window as any)?.google) return;

    let scope = "";
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get("action");

    if (action === "addEmailAccount") {
      scope = "https://mail.google.com email profile";
    } else if (action === "addCalendar") {
      scope =
        "email profile https://www.googleapis.com/auth/calendar.events.readonly";
    } else {
      scope = "https://mail.google.com email profile";
    }

    (window as any).google.accounts.oauth2
      .initCodeClient({
        client_id: clientId,
        scope: scope,
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

      (window as any).google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });

      // Automatically initiate OAuth flow once Google client is initialized
      getAuthCode();
    };

    loadGsiScript();
  }, [clientId, handleCredentialResponse, getAuthCode]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">
          Connecting to Google...
        </h2>
        <p className="text-gray-500 mt-2">
          Please wait while we set up your Google connection.
        </p>
      </div>
    </div>
  );
};
