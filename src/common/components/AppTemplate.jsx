import React from 'react';
import {Nav, Navbar, Container} from 'react-bootstrap';

import AppLogin from './login/AppLogin';

function AppTemplate({children}) {
    return (
        <React.Fragment>
            <Navbar bg="dark" variant="dark" id="app-header">
                <Navbar.Brand href="#home">COVID-19</Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link href="/admin">Admin Page</Nav.Link>
                </Nav>
                <Navbar.Text style={{float:'right', paddingTop: '0rem'}}>
                    {/* Added for Google Login functionality */}
                    <AppLogin/>
                </Navbar.Text>
            </Navbar>
            <Container>
                {children}
            </Container>
        </React.Fragment>
    )
}

export default AppTemplate;