import React from 'react';

import { GoogleLogin } from 'react-google-login';


import UserConfig from './lib/UserConfig.js'

function Login(props) {
  // TODO we need to store the clientid somewhere else as a environment variable and pass in during deployment
  var c = new UserConfig();
  const clientId = c.clientId;
  
 
  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={props.onSuccess}
        onFailure={props.onFailure}
        scope="https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/devstorage.read_write https://www.googleapis.com/auth/cloud-language"
        cookiePolicy={'single_host_origin'}
        style={{ marginTop: '100px' }}
        isSignedIn={true}
      />
    </div>
  );
}

export default Login;
