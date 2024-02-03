import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Dashboard } from "./components/Dashboard"
import { SignInPage } from "./components/SignInPage"
import { SignUpPage } from "./components/SignUpPage"
import { RecoilRoot } from "recoil"

function App() {

  return (
    <RecoilRoot>
        <BrowserRouter>
        <Routes>
            <Route path="/dashboard" element = {<Dashboard/>} />
            <Route path="/signin" element = {<SignInPage/>} />
            <Route path="/signup" element = {<SignUpPage/>} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
    
  )
}

export default App
