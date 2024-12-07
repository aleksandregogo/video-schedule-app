import { API_URL } from "@/config/appConfig";

function Login() {
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const handleFacebookLogin = () => {
    window.location.href = `${API_URL}/auth/facebook`;
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>SSO Login Example</h1>
      <button onClick={handleGoogleLogin} style={{ margin: '10px', padding: '10px 20px' }}>
        Login with Google
      </button>
      <button onClick={handleFacebookLogin} style={{ margin: '10px', padding: '10px 20px' }}>
        Login with Facebook
      </button>
    </div>
  );
}

export default Login;