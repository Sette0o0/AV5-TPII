import { Navigate, createHashRouter } from "react-router-dom";
import Layout from "../components/Layout";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("../pages/Home"));
const Cliente = lazy(() => import("../pages/Clientes"));
const Dependentes = lazy(() => import("../pages/Dependentes"));
const Hospedagem = lazy(() => import("../pages/Hospedagens"));
const Acomodacoes = lazy(() => import("../pages/Acomodacoes"));

const AppRoutes = createHashRouter([
  {
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Suspense fallback={<div>Carregando...</div>} children={<Home />} />,
      },
      {
        path: "/clientes",
        element: <Suspense fallback={<div>Carregando...</div>} children={<Cliente />} />,
      },
      {
        path: "/dependentes",
        element: <Suspense fallback={<div>Carregando...</div>} children={<Dependentes />} />,
      },
      {
        path: "/hospedagens",
        element: <Suspense fallback={<div>Carregando...</div>} children={<Hospedagem />} />,
      },
      {
        path: "/acomodacoes",
        element: <Suspense fallback={<div>Carregando...</div>} children={<Acomodacoes />} />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to={"/"} />,
  },
]);

export default AppRoutes;
