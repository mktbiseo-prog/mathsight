import { createBrowserRouter } from "react-router";
import { Layout } from "@/components/Layout/Layout";
import { HomePage } from "@/pages/Home/HomePage";
import { ConceptViewPage } from "@/pages/ConceptView/ConceptViewPage";
import { ProblemSolverPage } from "@/pages/ProblemSolver/ProblemSolverPage";
import { FreeExplorePage } from "@/pages/FreeExplore/FreeExplorePage";
import { NotFound } from "@/pages/NotFound";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "concept/:subjectId/:unitId", element: <ConceptViewPage /> },
      { path: "solve", element: <ProblemSolverPage /> },
      { path: "solve/:subjectId/:unitId", element: <ProblemSolverPage /> },
      { path: "explore", element: <FreeExplorePage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
