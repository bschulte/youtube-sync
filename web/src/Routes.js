// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route } from '@redwoodjs/router'
import RoomsLayout from 'src/layouts/RoomsLayout'
import AdminEditRoomPage from './pages/AdminRoom/EditRoomPage/EditRoomPage'
import AdminNewRoomPage from './pages/AdminRoom/NewRoomPage/NewRoomPage'
import AdminRoomPage from './pages/AdminRoom/RoomPage/RoomPage'
import AdminRoomsPage from './pages/AdminRoom/RoomsPage/RoomsPage'
import { RoomPage } from './pages/Room/RoomPage'

const Routes = () => {
  return (
    <Router>
      <Set wrap={RoomsLayout}>
        <Route path="/admin-rooms/new" page={AdminNewRoomPage} name="newRoom" />
        <Route path="/admin-rooms/{id:Int}/edit" page={AdminEditRoomPage} name="editRoom" />
        <Route path="/admin-rooms/{id:Int}" page={AdminRoomPage} name="room" />
        <Route path="/admin-rooms" page={AdminRoomsPage} name="rooms" />
      </Set>
      <Route path="/rooms/{id:Int}" page={RoomPage} name="home" />
      <Route path="/" page={HomePage} name="home" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
