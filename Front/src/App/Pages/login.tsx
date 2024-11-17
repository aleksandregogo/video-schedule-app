function Login() {
  const backendBaseUrl = 'http://localhost:5000/api/v1';

  const handleGoogleLogin = () => {
    window.location.href = `${backendBaseUrl}/auth/google`;
  };

  const handleFacebookLogin = () => {
    window.location.href = `${backendBaseUrl}/auth/facebook`;
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