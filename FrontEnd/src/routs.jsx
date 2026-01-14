import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./Pages/HomePage";
import AddPage from "./Pages/AddPage";
import SearchPage from "./Collection/Pages/SearchPage";
import ViewPage from "./Pages/ViewPage";
import CollectionLayout from "./Collection/CollectionLayout";
import CollectionHomePage from './Collection/Pages/CollectionHomePage'
import NotesPage from "./Collection/Pages/NotesPage";
import SingleNotePage from "./Collection/Pages/SingleNotePage";
import PoemPage from "./Collection/Pages/PoemPage";
import StoriePage from "./Collection/Pages/StoriePage";
import MediaPage from "./Collection/Pages/MediaPage";
import AdminEntry from "./AdminEntry";



const routes = createBrowserRouter([
  {
    path: "/main",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "search/:query", element: <SearchPage /> },
      { path: "view/:id", element: <ViewPage /> },
    ],
  },
  {
    path:'/admin',
    element:<AdminEntry/>
  },

  {
    path: "/add",
    element: <AddPage />,
  },

  {
    path: "/",
    element: <CollectionLayout />,
    children: [
      { index: true, element: <CollectionHomePage /> },

      {
        path: "notes",
        element: <NotesPage />,
      },
      {
        path:'poem',
        element:<PoemPage/>
      },
      {
        path:'stories',
        element:<StoriePage/>
      },
      {
        path:'media',
        element:<MediaPage/>
      },
      {
        path:'search',
        element:<SearchPage/>
      }

    ],
  },
  {
        path: "/notes/view/:id",
        element: <SingleNotePage />,
      },
]);


export default routes;
