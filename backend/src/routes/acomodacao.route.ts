import express from "express";
import {
  deleteAcomodacao,
  getAcomodacaoById,
  getAcomodacoes,
  postAcomodacao,
  putAcomodacao,
} from "../controllers/acomodacao.controller.js";

const routes = express.Router();

routes.get("/", getAcomodacoes);
routes.get("/:id", getAcomodacaoById);

routes.post("/", postAcomodacao);
routes.put("/:id", putAcomodacao);
routes.delete("/:id", deleteAcomodacao);

export default routes;
