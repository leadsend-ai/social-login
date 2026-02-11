import { useEffect } from "react";

export const AuthLanding = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    const code = urlParams.get("code");
    const stateParam = urlParams.get("state");

    if (error) {
      if (stateParam) {
        try {
          const state = JSON.parse(stateParam);
          const { redirectUrl, action, isCrm } = state;
          if (redirectUrl) {
            const redirectWithError = new URL(redirectUrl);
            redirectWithError.searchParams.set("error", error);
            if (action) redirectWithError.searchParams.set("action", action);
            if (action === "addEmailAccount" && isCrm)
              redirectWithError.searchParams.set("isCrm", isCrm);
            window.location.href = redirectWithError.toString();
            return;
          }
        } catch (err) {
          console.error("Error parsing state on OAuth error:", err);
        }
      }
      return;
    }

    // Handle redirect response from Google OAuth
    if (code && stateParam) {
      try {
        const state = JSON.parse(stateParam);
        const { redirectUrl, action, isCrm } = state;

        if (redirectUrl) {
          const redirectUrlWithToken = new URL(redirectUrl);
          redirectUrlWithToken.searchParams.append("credential", code);

          if (action === "addEmailAccount") {
            redirectUrlWithToken.searchParams.append("isCrm", isCrm ?? "false");
            window.location.href = redirectUrlWithToken.toString();
          } else if (action === "addCalendar") {
            redirectUrlWithToken.searchParams.append("addCalendar", "true");
            window.location.href = redirectUrlWithToken.toString();
          } else {
            // Default case: just redirect with credential
            window.location.href = redirectUrlWithToken.toString();
          }
        } else {
          console.log("Encoded JWT ID token:", code);
          // No redirect URL provided, handle token locally
        }
      } catch (err) {
        console.error("Error parsing state:", err);
      }
      return;
    }
  }, []);

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
