import './App.css'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar'
import MajorTodo from './components/majorTodo'

function App() {

  return (
    <>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path='/'>
          <Route index element = {<MajorTodo/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
