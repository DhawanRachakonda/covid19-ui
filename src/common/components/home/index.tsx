import React from 'react';

import Map from './Map';
import AppFilter from './AppFilter';

export default () => {
    return (
        <React.Fragment>
            <AppFilter/>
            <Map/>
        </React.Fragment>
    )
}