import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom"

import { Home } from "@/pages/Home"
import { ApolloProvider } from "@apollo/client/react/context/ApolloProvider"
import { Toaster } from "./components/ui/sonner"
import { Explore } from "./pages/Explore"
import { Irys } from "./pages/Irys"
import { IssuerList } from "./pages/IssuerList"
import Landing from "./pages/Landing"
import Leaderboard from "./pages/Leaderboard"
import { Profile } from "./pages/Profile"
import { ProjectDetails } from "./pages/ProjectDetails"
import NftCollectionPage from "./pages/TestQL"
import Upload from "./pages/Upload"
import client from "./utils/apollo-client"

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
      {
        path: "/test2",
        element: <NftCollectionPage />,
      },
    ],
  },
])

function App() {
  return (
    <>
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </ApolloProvider>
    </>
  )
}

export default App
