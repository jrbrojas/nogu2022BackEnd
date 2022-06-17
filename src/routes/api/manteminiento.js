const express = require("express");
const router = express.Router();
const {
    posUbigeo,
    postFilDocumento,
    getListTipoDocumento,
    getListPaises,
    getListEstadoCivil,
    postListRegistros,
    postListRegistrosNaturalPDF,
    postListRegistrosJuridicaPDF
} = require("../../controllers/mantenimientoController");

router.post("/ubigeo", posUbigeo);
router.post("/fildocumento", postFilDocumento);
router.get("/listtipodocumento", getListTipoDocumento);
router.get("/listpaises", getListPaises);
router.get("/listestadocivil", getListEstadoCivil);
router.post("/listregistros", postListRegistros);
router.post("/registrospdfnatural", postListRegistrosNaturalPDF);
router.post("/registrospdfjuridica", postListRegistrosJuridicaPDF);

module.exports = router;