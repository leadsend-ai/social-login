import { useCallback, useEffect } from "react";

const GOOGLE_CONNECT_SCOPE = [
  "https://mail.google.com/",
  "https://www.googleapis.com/auth/calendar.events.readonly",
  "email",
  "profile",
].join(" ");

export const GoogleSocialConnect = () => {
  const clientId =
    process.env.REACT_APP_GOOGLE_CLIENT_ID || "your-google-client-id";

  const buildStateObject = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get("redirect_url");
    const action = urlParams.get("action");
    const isCrm = urlParams.get("isCrm");

    const state: {
      redirectUrl: string | null;
      action: string | null;
      isCrm?: string | null;
    } = {
      redirectUrl,
      action,
    };

    // Add additional parameters based on action type
    if (action === "addEmailAccount" && isCrm) {
      state.isCrm = isCrm;
    }

    return state;
  }, []);

  const getAuthCode = useCallback(() => {
    if (!(window as any)?.google) return;

    let scope = "";
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get("action");

    if (action === "syncGoogleAccount") {
      scope = GOOGLE_CONNECT_SCOPE;
    } else if (action === "addEmailAccount") {
      scope = "https://mail.google.com email profile";
    } else if (action === "addCalendar") {
      scope =
        "email profile https://www.googleapis.com/auth/calendar.events.readonly";
    } else {
      scope = "https://mail.google.com email profile";
    }

    const stateObject = buildStateObject();

    (window as any).google.accounts.oauth2
      .initCodeClient({
        client_id: clientId,
        scope: scope,
        ux_mode: "redirect",
        redirect_uri: window.location.origin,
        state: JSON.stringify(stateObject),
        access_type: "offline",
        callback: (response: any) => {
          // Note: In redirect mode, this callback may not be called
          // The response is typically handled via URL parameters after redirect
          console.log("token", response);
        },
      })
      .requestCode();
  }, [clientId, buildStateObject]);

  useEffect(() => {
    // Load the Google API library only if not handling a redirect response
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

      // Automatically initiate OAuth flow once Google client is initialized
      getAuthCode();
    };

    loadGsiScript();
  }, [clientId, getAuthCode]);

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
