const express = require("express");
const router= express.Router();
const {contactForm,getContact} = require("../controller/contact-controller");
const {contactSchema} = require("../validators/auth-validator");
const validate = require("../middlewares/validate-middleware");
const authMiddleware = require("../middlewares/auth-middleware");

router.route("/contact").post(validate(contactSchema),contactForm);
router.route("/contact").get(getContact);

module.exports = router;