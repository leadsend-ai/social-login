import { GoogleLogin } from "@react-oauth/google";
import { useCallback } from "react";

// TypeScript interfaces for OAuth response
interface GoogleOAuthResponse {
  credential?: string;
  clientId?: string;
  select_by?: string;
}

interface BroadcastMessage {
  type: "GOOGLE_OAUTH_SUCCESS" | "GOOGLE_OAUTH_ERROR";
  payload: {
    credential?: string;
    error?: string;
    timestamp: number;
    source: "social-login-app";
  };
}

export const GoogleSocialLogin = () => {
  // Function to send OAuth response via PostMessage (cross-domain)
  const sendOAuthResponse = useCallback(
    (response: GoogleOAuthResponse, isError = false) => {
      const message: BroadcastMessage = {
        type: isError ? "GOOGLE_OAUTH_ERROR" : "GOOGLE_OAUTH_SUCCESS",
        payload: {
          credential: response.credential,
          error: isError ? "OAuth authentication failed" : undefined,
          timestamp: Date.now(),
          source: "social-login-app",
        },
      };

      // console.log("📨 [PostMessage] Message to send:", message);

      // Get target origin from URL params or use default
      const urlParams = new URLSearchParams(window.location.search);
      const targetOrigin =
        urlParams.get("target_origin") || "http://localhost:4200";

      // console.log("🎯 [PostMessage] Target origin:", targetOrigin);

      try {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage(message, targetOrigin);
          console.log("✅ [PostMessage] Message sent to parent window");
        }
      } catch (error) {
        console.warn("⚠️ [PostMessage] Failed to send to parent:", error);
      }
    },
    []
  );

  return (
    <div className="flex items-center justify-center w-full h-full min-h-[50px]">
      <GoogleLogin
        size="large"
        width="360px"
        type="standard"
        theme="outline"
        logo_alignment="left"
        shape="rectangular"
        onSuccess={async (resp: GoogleOAuthResponse) => {
          // Send response via PostMessage to parent window (localhost:4200)
          sendOAuthResponse(resp);
          return;
        }}
        onError={() => {
          // Send error via PostMessage to parent window
          sendOAuthResponse({}, true);
        }}
        ux_mode="popup"
      />
    </div>
  );
};

export default GoogleSocialLogin;
