import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom"

import { Home } from "@/pages/Home"
import { mockTelegramEnv, parseInitData } from "@telegram-apps/sdk"
import {
  bindViewportCSSVars,
  initSwipeBehavior,
  useViewport,
} from "@telegram-apps/sdk-react"
import { useEffect } from "react"
import CallbackPage from "./pages/Callback"
import { Explore } from "./pages/Explore"
import { Irys } from "./pages/Irys"
import { IssuerList } from "./pages/IssuerList"
import Landing from "./pages/Landing"
import Leaderboard from "./pages/Leaderboard"
import Play from "./pages/Play"
import { Profile } from "./pages/Profile"
import { ProjectDetails } from "./pages/ProjectDetails"

const initDataRaw = new URLSearchParams([
  [
    "user",
    JSON.stringify({
      id: 99281932,
      first_name: "Andrew",
      last_name: "Rogue",
      username: "rogue",
      language_code: "en",
      is_premium: true,
      allows_write_to_pm: true,
    }),
  ],
  ["hash", "89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31"],
  ["auth_date", "1716922846"],
  ["start_param", "debug"],
  ["chat_type", "sender"],
  ["chat_instance", "8428209589180549439"],
]).toString()

mockTelegramEnv({
  themeParams: {
    accentTextColor: "#6ab2f2",
    bgColor: "#17212b",
    buttonColor: "#5288c1",
    buttonTextColor: "#ffffff",
    destructiveTextColor: "#ec3942",
    headerBgColor: "#17212b",
    hintColor: "#708499",
    linkColor: "#6ab3f3",
    secondaryBgColor: "#232e3c",
    sectionBgColor: "#17212b",
    sectionHeaderTextColor: "#6ab3f3",
    subtitleTextColor: "#708499",
    textColor: "#f5f5f5",
  },
  initData: parseInitData(initDataRaw),
  initDataRaw,
  version: "7.7",
  platform: "tdesktop",
})

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
        path: "/play",
        element: <Play />,
      },
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
        element: <Irys />,
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
  const [swipeBehavior] = initSwipeBehavior()
  const viewport = useViewport()

  useEffect(() => {
    if (swipeBehavior) {
      swipeBehavior.disableVerticalSwipe()
    }
  }, [swipeBehavior])

  useEffect(() => {
    if (viewport) {
      viewport.expand()
    }

    return viewport && bindViewportCSSVars(viewport)
  }, [viewport])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
