import express from "express";
import {
  deleteCliente,
  getClienteById,
  getClientes,
  getDependentesByTitular,
  getTitularByDependente,
  postClienteDependentes,
  postClienteTitular,
  putCliente,
} from "../controllers/cliente.controller.js";

const router = express.Router();

router.get("/", getClientes);
router.get("/:id", getClienteById);
router.get("/:id/dependentes", getDependentesByTitular);
router.get("/:id/titular", getTitularByDependente);

router.post("/", postClienteTitular);
router.post("/:id/dependentes", postClienteDependentes);

router.put("/:id", putCliente);

router.delete("/:id", deleteCliente);

export default router;
