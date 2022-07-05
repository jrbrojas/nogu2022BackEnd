const express = require("express");
const router = express.Router();
const {
    getList,
    postInsertA,
    postInsertB,
    postList,
    postUpdateA,
    postUpdateB,
    postDeleteContribuyente,
    postConsultaPlacaVahicular,
    postInsertKardex,
    postListarKardex,
    postDescrgarKardex,
    postDelete
} = require("../../controllers/formularioController");

router.get("/list", getList);
router.post("/inserta", postInsertA);
router.post("/insertb", postInsertB);
router.post("/postlist", postList);
router.post("/updatea", postUpdateA);
router.post("/updateb", postUpdateB);
router.post("/deleteContribuyente", postDeleteContribuyente);
router.post("/consultaPlacaVahicular", postConsultaPlacaVahicular);
router.post("/insertKardex", postInsertKardex);
router.post("/listarKardex", postListarKardex);
router.post("/descargarKardex", postDescrgarKardex);
router.post("/Delete", postDelete);

module.exports = router;