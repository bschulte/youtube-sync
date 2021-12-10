import { Button, Divider, Grid, Typography } from '@mui/material'
import { navigate } from '@redwoodjs/router'
import { MetaTags, useMutation } from '@redwoodjs/web'

const CREATE_ROOM = gql`
  mutation CreateRoomMutation($input: CreateRoomInput!) {
    createRoom(input: $input) {
      id
    }
  }
`

const HomePage = () => {
  const [create] = useMutation(CREATE_ROOM)

  const createRoom = async () => {
    const { data } = await create({ variables: { input: {} } })
    console.log('Room id:', data.createRoom.id)

    navigate(`/rooms/${data.createRoom.id}?isHost=true`)
  }

  return (
    <>
      <MetaTags
        title="Home"
        description="Home page for Youtube syncing service"
      />

      <Grid container justifyContent="center" direction="row">
        <Grid item xs />
        <Grid item xs={6}>
          <Typography variant="h1">Youtube Sync</Typography>
          <Divider />

          <Button variant="contained" onClick={createRoom}>
            Create Room
          </Button>
        </Grid>

        <Grid item xs />
      </Grid>
    </>
  )
}

export default HomePage
