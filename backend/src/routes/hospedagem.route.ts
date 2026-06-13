import express from "express";
import {
  deleteHospedagem,
  encerrarHospedagem,
  getHospedagemById,
  getHospedagens,
  postHospedagem,
  putHospedagem,
} from "../controllers/hospedagem.controller.js";

const routes = express.Router();

routes.get("/", getHospedagens);
routes.get("/:id", getHospedagemById);

routes.post("/", postHospedagem);
routes.put("/:id", putHospedagem);
routes.patch("/:id/checkout", encerrarHospedagem);
routes.delete("/:id", deleteHospedagem);

export default routes;
