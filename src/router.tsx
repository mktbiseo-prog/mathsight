import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import { Layout } from "@/components/Layout/Layout";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { RootPage } from "@/pages/RootPage";
import { NotFound } from "@/pages/NotFound";

const ConceptViewPage = lazy(() =>
  import("@/pages/ConceptView/ConceptViewPage").then((m) => ({ default: m.ConceptViewPage }))
);
const ProblemSolverPage = lazy(() =>
  import("@/pages/ProblemSolver/ProblemSolverPage").then((m) => ({ default: m.ProblemSolverPage }))
);
const FreeExplorePage = lazy(() =>
  import("@/pages/FreeExplore/FreeExplorePage").then((m) => ({ default: m.FreeExplorePage }))
);
const CalculusVizPage = lazy(() =>
  import("@/pages/CalculusViz/CalculusVizPage").then((m) => ({ default: m.CalculusVizPage }))
);
const FormulaVizPage = lazy(() =>
  import("@/pages/FormulaViz/FormulaVizPage").then((m) => ({ default: m.FormulaVizPage }))
);

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <RootPage /> },
      { path: "concept/:subjectId/:unitId", element: <Lazy><ConceptViewPage /></Lazy> },
      { path: "solve", element: <Lazy><ProblemSolverPage /></Lazy> },
      { path: "solve/:subjectId/:unitId", element: <Lazy><ProblemSolverPage /></Lazy> },
      { path: "explore", element: <Lazy><FreeExplorePage /></Lazy> },
      { path: "calculus-viz", element: <Lazy><CalculusVizPage /></Lazy> },
      { path: "formula-viz", element: <Lazy><FormulaVizPage /></Lazy> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
