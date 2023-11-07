import React from 'react'

export default function TrackSearchResult({track, selectTrack}) {

  function handlePlay() {
    selectTrack(track)
  }

  return (
    <div className='d-flex m-2 align-items-center'
      style={{cursor: 'pointer'}}
      onClick={handlePlay}
    >
      <img src={track.albumUrl} style={{height: '64px', width: '64px', marginRight: '10px'}}/>
      <div className='ml-3' style={{color: 'white'}}>
          <div>{track.title}</div>
          <div style={{color: 'white'}}>{track.artist}</div>
      </div>
    </div>
  )
}
