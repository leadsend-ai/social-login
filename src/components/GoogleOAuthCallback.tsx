import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const GoogleOAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract the authorization code from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const error = urlParams.get("error");

    if (error) {
      console.error("OAuth error:", error);
      // Handle error - maybe redirect to error page or show message
      navigate("/", { replace: true });
      return;
    }

    if (code) {
      console.log("OAuth code received:", code);

      // Here you would typically:
      // 1. Send the code to your backend
      // 2. Backend exchanges code for access token
      // 3. Store tokens securely
      // 4. Redirect user to success page

      // For now, just log and redirect
      console.log("Authorization successful! Code:", code);

      // You can redirect to a success page or back to main app
      // navigate("/success", { replace: true });

      // Or redirect back to home for now
      navigate("/", { replace: true });
    } else {
      // No code and no error - something went wrong
      console.error("No authorization code received");
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">
          Processing your Google authentication...
        </h2>
        <p className="text-gray-500 mt-2">
          Please wait while we complete the setup.
        </p>
      </div>
    </div>
  );
};

export default GoogleOAuthCallback;

