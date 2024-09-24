import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom"

import { Home } from "@/pages/Home"
import CallbackPage from "./pages/Callback"
import { Explore } from "./pages/Explore"
import { Irys } from "./pages/Irys"
import { IssuerList } from "./pages/IssuerList"
import Landing from "./pages/Landing"
import Leaderboard from "./pages/Leaderboard"
import { Profile } from "./pages/Profile"
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
        path: "/callback",
        element: <CallbackPage />,
      },
      {
        path: "/list",
        element: <IssuerList />,
      },
      {
        path: "/profile/:issuerAddress",
        element: <Profile />,
      },
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
      // {
      //   path: "/test2",
      //   element: <NftCollectionPage />,
      // },
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
