const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const { ChatOpenAI } = require('@langchain/openai');
const { initializeAgentExecutor } = require('langchain/agents');
const {  AIMessage,
    HumanMessage,
    SystemMessage,
    trimMessages, } = require("@langchain/core/messages")
const { StringOutputParser } = require("@langchain/core/output_parsers")
const { PromptTemplate,ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } = require('@langchain/core/prompts');


// Tüm performans sanatçılarını getirme işlemi
const addCompanyVector = asyncHandler(async (req, res) => {
  const { message } = req.body

  res.status(200).json({ message: "", data:"" });
});



module.exports = {
  addCompanyVector
};