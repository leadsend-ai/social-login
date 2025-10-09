import React from "react";
import { Routes, Route } from "react-router-dom";
import NotFound from "./components/NotFound";
import GoogleSocialLogin from "./components/GoogleSocialLogin";
import GoogleOAuthCallback from "./components/GoogleOAuthCallback";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./App.css";

function App() {
  return (
    <GoogleOAuthProvider
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID ?? ""}
    >
      <Routes>
        <Route path="/oauth/microsoft" element={<div>Microsoft OAuth</div>} />
        <Route path="/oauth/google" element={<GoogleSocialLogin />} />
        <Route
          path="/oauth/google/callback"
          element={<GoogleOAuthCallback />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;
