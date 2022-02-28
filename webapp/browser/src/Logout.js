import React from 'react';
import { GoogleLogout } from 'react-google-login';
import UserConfig from './lib/UserConfig.js'


function Logout(props) {
   // TODO we need to store the clientid somewhere else as a environment variable and pass in during deployment
  var gc = new UserConfig();
  const clientId = gc.clientId;

  return (
    <div>
      <GoogleLogout
        clientId={clientId}
        buttonText="Logout"
        onLogoutSuccess={props.onLogoutSuccess}
      ></GoogleLogout>
    </div>
  );
}

export default Logout;
