import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom"

import { Home } from "@/pages/Home"
import { Issuer } from "@/pages/Issuer"
import { MyProfile } from "@/pages/MyProfile"
import { Explore } from "./pages/Explore"
import { Irys } from "./pages/Irys"
import Landing from "./pages/Landing"
import Leaderboard from "./pages/Leaderboard"
import { ProjectDetails } from "./pages/ProjectDetails"
import Upload from "./pages/Upload"

function Layout() {
  return (
    <>
      <Outlet />
    </>
  )
}
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        path: "/explore",
        element: <Explore />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/issuer/:issuerAddress",
        element: <Issuer />,
      },
      {
        path: "/my-profile",
        element: <MyProfile />,
      },
      {
        path: "/project/:id",
        element: <ProjectDetails />,
      },
      {
        path: "/upload",
        element: <Upload />,
      },
      {
        path: "/leaderboard",
        element: <Leaderboard />,
      },
      {
        path: "/irys",
        element: <Irys />,
      },
    ],
  },
])

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
