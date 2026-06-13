import express from "express";
import acomodacaoRoutes from "./acomodacao.route.js";
import clienteRoutes from "./cliente.route.js";
import hospedagemRoutes from "./hospedagem.route.js";

const routes = express.Router();

routes.get("/", (_req, res) => {
  return res.status(200).json({
    name: "Atlantis API",
    status: "online",
  });
});

routes.use("/clientes", clienteRoutes);
routes.use("/acomodacoes", acomodacaoRoutes);
routes.use("/hospedagens", hospedagemRoutes);

export default routes;
