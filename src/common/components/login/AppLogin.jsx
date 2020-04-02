import React from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { Container, Row, Col, Image, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { useAppDispatch } from '../home/AppContext';

import './AppLogin.css';

function AppLogin() {

  const clientId = "1010884094950-je3leg3d81hq9001la1rk3j8udb0vmmn.apps.googleusercontent.com";

  const dispatch = useAppDispatch();

  const [userEmail, setUserEmail] = React.useState("");
  const [userImageURL, setUserImageURL] = React.useState("");
  const [userName, setUserName] = React.useState("");

  const setProfileData = (email, imageUrl, name) => {
    setUserEmail(email);
    setUserImageURL(imageUrl);
    setUserName(name);
    
    dispatch({
      type: 'SET_USER_DETAILS_IN_RTG',
      payload: {
        emailValue: email,
        nameValue: name
      }
    });
  }

  const responseGoogle = (response) => {
    if (response) {
      if (response.error) {
        console.log('Unable to fetch user google profile!');
      } else if (response.profileObj) {
        let gPrf = response.profileObj;
        setProfileData(gPrf.email, gPrf.imageUrl/* .replace("s96-c", "s46-c") */, gPrf.name);
      }
    }
  }

  const loggedOutSuccesfully = (response) => {
    console.log('Loggedout successfully from Google!');
    //Clear the data
    setProfileData("", "", "'");
  }

  const logoutFailed = (response) => {
    console.log('Failed to logout from Google!');
  }

  let loginComponent;

  if (userEmail !== "") {
    loginComponent =
      <Row className="justify-content-md-center">
        <Col md="auto"><p className="welcome-msg">Welcome, {userName.toUpperCase()} !</p></Col>
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 250, hide: 400 }}
          overlay={
            <Tooltip id="button-tooltip">
              {userEmail}
            </Tooltip>
          }
        >
          <Col md="auto"><Image className="google-image" src={userImageURL} fluid roundedCircle /></Col>
        </OverlayTrigger>

        <Col md="auto">
          <GoogleLogout
            clientId={clientId}
            buttonText="Sign Out"
            onLogoutSuccess={loggedOutSuccesfully}
            onFailure={logoutFailed}
          />
        </Col>
      </Row >

  } else {
    loginComponent =
      <GoogleLogin
        clientId={clientId}
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
        isSignedIn={true}
      />
  }

  return (
    <Container>
      {loginComponent}
    </Container>
  );
}
export default AppLogin;

