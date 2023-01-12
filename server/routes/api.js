import express from "express";
var router = express.Router();
import createController from "../controllers/CreditController";

router.post("/credit/create", function (req, res, next) {
  const {response, status} = createController.create(req, res);
  res.json(response).status(status || 500);
});


router.post("/credit/validate", async (req, res, next) =>{
  const {response , status} = await createController.validate(req, res)
  res.json(response).status(status || 500);
});

module.exports = router;
