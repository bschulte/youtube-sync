import { useState, useEffect } from 'react'
import { Divider, Grid, TextField, Typography } from '@mui/material'
import YouTube from 'react-youtube'
import { useMutation } from '@redwoodjs/web'
import { useLazyQuery } from '@apollo/client'
import { useParams } from '@redwoodjs/router'

const UPDATE_ROOM = gql`
  mutation UpdateRoomMutation($id: Int!, $input: UpdateRoomInput!) {
    updateRoom(id: $id, input: $input) {
      id
      videoUrl
    }
  }
`

const GET_ROOM = gql`
  query GetRoom($id: Int!) {
    room(id: $id) {
      id
      videoUrl
      currentTime
    }
  }
`

export const RoomPage = ({ id }) => {
  const [videoUrl, setVideoUrl] = useState('')
  const [playingVideoUrl, setPlayingVideoUrl] = useState('')
  const [updateIntervalId, setUpdateIntervalId] = useState(null)

  const [updateRoom] = useMutation(UPDATE_ROOM)
  const [getRoom] = useLazyQuery(GET_ROOM)

  const handleKeyPress = (key) => {
    if (key.code === 'Enter') {
      console.log('Submitting')
      setPlayingVideoUrl(videoUrl)

      updateRoom({
        variables: {
          input: {
            videoUrl,
          },
          id,
        },
      })
    }
  }

  const getYoutubeId = () => {
    if (playingVideoUrl) {
      const id = new URL(playingVideoUrl).searchParams.get('v')
      console.log('Youtube video id:', id)

      return id
    }

    return null
  }

  const handleVideoStateChange = (state) => {
    console.log('State:', state)
  }

  const { isHost } = useParams()

  const handleOnReady = ({ target: player }) => {
    const updateIntervalId = setInterval(() => {
      // If you're the host of the room, update the database with the current time
      if (isHost === 'true') {
        const currentTime = player.getCurrentTime()
        console.log('Current time:', currentTime)

        updateRoom({
          variables: {
            id,
            input: {
              currentTime,
            },
          },
        })
      }
    }, 5000)

    setUpdateIntervalId(updateIntervalId)
  }

  // Load existing Room data if available
  useEffect(() => {
    async function getData() {
      const { data } = await getRoom({ variables: { id } })
      console.log('Init data:', data)

      if (data.room?.videoUrl) {
        setVideoUrl(data.room.videoUrl)
        setPlayingVideoUrl(data.room.videoUrl)
      }
    }

    getData()

    return function cleanup() {
      clearInterval(updateIntervalId)
    }
  }, [])

  return (
    <Grid container>
      <Grid item xs={3} />
      <Grid item xs={6}>
        <Typography>Welcome to room: {id}</Typography>
        {/* <Typography>Video URL: {playingVideoUrl}</Typography> */}

        <TextField
          id="video-url-input"
          label="Video URL"
          variant="outlined"
          value={videoUrl}
          sx={{ width: 400, marginY: 4 }}
          onChange={(e) => setVideoUrl(e.target.value)}
          onKeyPress={handleKeyPress}
        />

        <Typography>Playing URL: {playingVideoUrl}</Typography>

        <Divider sx={{ marginY: 4 }} />

        <YouTube
          videoId={getYoutubeId()}
          opts={{ playerVars: { autoplay: 1 } }}
          onStateChange={handleVideoStateChange}
          onReady={handleOnReady}
        />
      </Grid>
    </Grid>
  )
}
