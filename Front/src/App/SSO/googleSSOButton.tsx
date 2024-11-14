import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function GoogleSSOButton ()  {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <GoogleLogin
        onSuccess={credentialResponse => {
          const token = credentialResponse.credential;
          // Send the token to the backend for verification
          fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          })
            .then(response => response.json())
            .then(data => {
              // Handle response, e.g., save the session, navigate to dashboard, etc.
              console.log(data);
            });
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </GoogleOAuthProvider>
  )
}

export default GoogleSSOButton;