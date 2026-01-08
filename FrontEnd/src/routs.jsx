import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./Pages/HomePage";
import AddPage from "./Pages/AddPage";
import SearchPage from "./Pages/SearchPage";
import ViewPage from "./Pages/ViewPage";
// import CollectionLayout from "./CollectionLayout";
import CollectionLayout from "./Collection/CollectionLayout";
// import CollectionDetail from "./Pages/CollectionDetail"; 
import CollectionHomePage from './Collection/Pages/CollectionHomePage'
import NotesPage from "./Collection/Pages/NotesPage";
import SingleNotePage from "./Collection/Pages/SingleNotePage";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "search/:query", element: <SearchPage /> },
      { path: "view/:id", element: <ViewPage /> },
    ],
  },

  {
    path: "/add",
    element: <AddPage />,
  },

  {
    path: "/collections",
    element: <CollectionLayout />,
    children: [
      { index: true, element: <CollectionHomePage /> },

      {
        path: "notes",
        element: <NotesPage />,
      },

    ],
  },
  {
        path: "/collections/notes/view/:id",
        element: <SingleNotePage />,
      },
]);


export default routes;
