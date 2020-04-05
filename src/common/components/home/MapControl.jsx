import React from 'react';
import Control from 'react-leaflet-control';
import { MdFullscreenExit, MdFullscreen} from 'react-icons/md'

export default function MapControls() {

  const [isFullScreenEnabled, setIsFullScreenEnabled] = React.useState(false);

  return (
    <Control position="topright">
      {!isFullScreenEnabled && <MdFullscreen className="full-screen" style={{ fontSize: 30 }} onClick={() =>  {document.querySelector(".infected-list--map").requestFullscreen();setIsFullScreenEnabled(!isFullScreenEnabled) }}/>}
      {isFullScreenEnabled && <MdFullscreenExit  className="full-screen--exit" style={{ fontSize: 30 }} onClick={() => {document.exitFullscreen(); setIsFullScreenEnabled(!isFullScreenEnabled)} }/>}
    </Control>
  );
}
