const express = require("express")
const route = express.Router()
const { describe,answerTheQuestion,cancelTheQuestion } = require("../controller/conversition")

route.post("/conversition", describe)
route.post("/answer_question", answerTheQuestion)
route.post("/cancel_question", cancelTheQuestion)

module.exports = route