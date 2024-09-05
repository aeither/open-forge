import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom"

import { Home } from "@/pages/Home"
import { Issuer } from "@/pages/Issuer"
import { MyProfile } from "@/pages/MyProfile"
import { Explore } from "./pages/Explore"
import Landing from "./pages/Landing"
import { ProjectDetails } from "./pages/ProjectDetails"

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
