import { useState, useEffect } from 'react'
import { Button, Divider, Grid, TextField, Typography } from '@mui/material'
import ShareIcon from '@mui/icons-material/Share'
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
  const [getRoom] = useLazyQuery(GET_ROOM, { variables: { id } })

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
      return new URL(playingVideoUrl).searchParams.get('v')
    }

    return null
  }

  const handleVideoStateChange = (state) => {
    console.log('State:', state)

    if (state.data === -1) {
      state.target.playVideo()
    }
  }

  const { isHost } = useParams()

  const handleOnReady = async ({ target: player }) => {
    console.log('On ready called')

    const updateIntervalId = setInterval(async () => {
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
      } else {
        // If we're not the host we should always be checking the current time against our own time
        const { data } = await getRoom()
        const hostTime = data.room?.currentTime
        if (hostTime) {
          // Check if we're more than 5 seconds off of the host's timestamp and adjust if necessary
          if (Math.abs(player.getCurrentTime() - hostTime) > 5) {
            console.log(
              'Diff with host is greater than 5 seconds, seeking to:',
              hostTime
            )

            player.seekTo(hostTime)
          }
        }
      }
    }, 5000)

    setUpdateIntervalId(updateIntervalId)

    // Start the video at the current time if we have one set for the room
    setTimeout(async () => {
      console.log('Playing video')

      player.playVideo()
      const { data } = await getRoom()
      if (data.room?.currentTime) {
        console.log('Initially seeking to current time:', data.room.currentTime)
        player.seekTo(data.room.currentTime)
      }
    }, 2000)
  }

  const copyShareLinkToClipboard = () => {
    const link = window.location.href.replace(window.location.search, '')
    console.log('Copying share link to clipboard:', link)
    navigator.clipboard.writeText(link)
  }

  const getPlayerOpts = () => {
    if (!isHost) {
      return {
        disablekb: '1',
        // controls: '0',
      }
    }

    return {}
  }

  // Load existing Room data if available
  useEffect(() => {
    async function getData() {
      const { data } = await getRoom()
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
        <Grid container alignItems="center" justifyContent="space-between">
          <Typography>Welcome to room: {id}</Typography>
          <Button
            variant="contained"
            startIcon={<ShareIcon />}
            onClick={copyShareLinkToClipboard}
          >
            Get share link
          </Button>
        </Grid>

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
          onStateChange={handleVideoStateChange}
          onReady={handleOnReady}
          opts={{
            playerVars: getPlayerOpts(),
          }}
        />
      </Grid>
    </Grid>
  )
}
