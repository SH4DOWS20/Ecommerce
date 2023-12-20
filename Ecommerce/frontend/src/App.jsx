import React from 'react'
import {Routes, Route} from 'react-router-dom'
import ShowHats from './pages/ShowHats'
import EditHats from './pages/EditHats'
import DeleteHats from './pages/DeleteHats'
import CreateHats from './pages/CreateHats'
import Home from './pages/Home'

const App = () => {
  return (
    <Routes>
      <Route path= '/' element={ Home }/>
      <Route path= '/hats/create' element={CreateHats}/>
      <Route path= '/hats/details/:id' element={ShowHats}/>
      <Route path= '/hats/edit/:id' element={EditHats}/>
      <Route path= '/hats/delete/:id' element={DeleteHats}/>
    </Routes>
  )
}

export default App