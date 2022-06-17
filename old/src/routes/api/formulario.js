const express = require("express");
const router = express.Router();
const {
    getList,
    postInsertA,
    postInsertB,
    postList,
    postUpdateA,
    postUpdateB,
    postDelete
} = require("../../controllers/formularioController");

router.get("/list", getList);
router.post("/inserta", postInsertA);
router.post("/insertb", postInsertB);
router.post("/postlist", postList);
router.post("/updatea", postUpdateA);
router.post("/updateb", postUpdateB);
router.post("/delete", postDelete);

module.exports = router;