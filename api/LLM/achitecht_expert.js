const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {
  architect_expert_system_message,
} = require("../promts/architect_expert_system_message");
const { ChatOpenAI } = require("@langchain/openai");
const { initializeAgentExecutor } = require("langchain/agents");
const {
  AIMessage,
  HumanMessage,
  SystemMessage,
  trimMessages,
} = require("@langchain/core/messages");
const { StringOutputParser } = require("@langchain/core/output_parsers");

const {
  PromptTemplate,
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} = require("@langchain/core/prompts");

const getExpertSuggest = asyncHandler(async (id,expert_message) => {
  const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.2 });
  console.log("getExpertSuggest expert_message",expert_message)

  const _architect_expert_system_message =
    architect_expert_system_message.replace("{expert_message}", expert_message);

  const result = await model.invoke(_architect_expert_system_message);
  const parser = new StringOutputParser();
  const llmAnswer = await parser.invoke(result);
  console.log("getExpertSuggest llmAnswer",llmAnswer)

  console.log("getExpertSuggest",llmAnswer, JSON.parse(llmAnswer))
  return JSON.parse(llmAnswer);
 });
module.exports = {
  getExpertSuggest,
};
