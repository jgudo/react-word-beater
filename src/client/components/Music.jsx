import React from 'react';

const Music = ({ audioHandler, audioMuted }) => (
  <div className="beater__audio-control">
    <span>MUSIC</span>
    <div 
      className="beater__audio-control-wrapper"
      onClick={audioHandler}
      style={{
        background: audioMuted ? 'rgba(255, 255, 255, .2)' : 'rgba(153,218,0, .2)'
      }}
    >
      <div 
        className="beater__audio-control-toggle"
        style={{
          transform: audioMuted ? 'translateX(0)' : 'translateX(100%)',
          background: audioMuted ? '#cacaca' : '#99da00'
        }}
      ></div>
    </div>
  </div>
);

export default Music;
