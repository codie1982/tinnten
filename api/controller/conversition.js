const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const conversition = require("../model/conversitionModel");
const questions = require("../model/questionsModel");
const company = require("../model/companyModel");
const { system_templete_message } = require("../promts/system_message");
const { ChatOpenAI } = require("@langchain/openai");
const { initializeAgentExecutor } = require("langchain/agents");
const ApiResponse = require("../helpers/response");
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
const selectedExpert = require("../LLM/selected_expert");

const describe = asyncHandler(async (req, res) => {
  const { human_message, id } = req.body;
  conversitionid = Number(id);
  var selectedConversitionObjectID;
  const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.2 });
  const _system_message = system_templete_message.replace(
    "{human_message}",
    human_message
  );
  const selectedConversition = await conversition
    .findOne({ conversitionid })
    .populate("conversitionid");
  if (selectedConversition == null) {
    const procedure = system_templete_message; //Kullanıcıya gönderilen LLM yönergeleri
    const result = await model.invoke(_system_message);
    const parser = new StringOutputParser();
    const llmAnswer = await parser.invoke(result);
    const llmJson = JSON.parse(llmAnswer);
    console.log("llmJson", llmJson);

    let LLMconversition = [
      {
        system_response: llmJson.system_message,
        human_message: human_message,
      },
    ];

    let expert_suggest = "";
    if (llmJson.profession != "") {
      expert_suggest = await selectedExpert(
        llmJson.profession,
        conversitionid,
        llmJson.expert_message
      );
    }

    const createConversition = await conversition.create({
      conversitionid,
      procedure,
      profession: llmJson.profession,
      expert_suggest,
      conversition: LLMconversition,
      suggest: {
        services: [],
        products: [],
      },
    }); //Bu konuşmanın ilk kaydı

    if (createConversition) {
      console.log("createConversition", createConversition);
      const createConversitionID = createConversition._id;
      let QAS = [];
      if (llmJson.question != null && llmJson.question.length != 0) {
        for (let i = 0; i < llmJson.question.length; i++) {
          let QA = {
            conversitionid: createConversitionID,
            important: llmJson.question[i].important,
            input_type: llmJson.question[i].input_type,
            options:
              llmJson.question[i].options == undefined
                ? []
                : llmJson.question[i].options,
            question: llmJson.question[i].q,
            answer: "",
          };
          QAS.push(QA);
        }
      }
      console.log("QAS", QAS);
      let suggestion;
      const createQuestion = await questions.insertMany(QAS);
      if ((llmJson.describe != null) & (llmJson.describe != "")) {
        suggestion = await getSuggesstion(llmJson.request_type,llmJson.describe.join(","))
        console.log("suggestion",suggestion)
      }

      res.status(200).json(
        ApiResponse.success(200, "Sonuç Başarılı", {
          llm_message: llmJson.system_message,
          questions: createQuestion,
          suggestion
        })
      );
    } else {
      res.status(404).json(ApiResponse.error(404, "sonuç başarısız", {}));
    }
  } else {
    selectedConversitionObjectID = selectedConversition._id;

    const _system_procedure = selectedConversition.procedure;
    const selectedQuestions = await questions.find({
      conversitionid: selectedConversitionObjectID,
    });
    console.log("selectedQuestions", selectedQuestions);
    var QAS = "";
    for (let i = 0; i < selectedQuestions.length; i++) {
      QAS +=
        "system soru: " +
        selectedQuestions[i].question +
        " : " +
        "İnsan Cevap : " +
        selectedQuestions[i].answer +
        " \n";
    }
    const qa_system_text =
      QAS != "" ? _system_procedure.replace("{question/answer}", QAS) : "";
    var history = "";
    for (let i = 0; i < selectedConversition.conversition.length; i++) {
      history +=
        "system: " +
        selectedConversition.conversition[i].system_response +
        " : " +
        "insan : " +
        selectedConversition.conversition[i].human_message +
        " \n";
    }
    const history_system_text =
      history != ""
        ? qa_system_text.replace("{conversition_history}", history)
        : qa_system_text;

    const expert_system_text =
      selectedQuestions.expert_suggest != null
        ? history_system_text.replace(
            "{expert_opinion}",
            selectedQuestions.expert_suggest
          )
        : history_system_text;

    const request_system_text =
      selectedQuestions.expert_suggest != null
        ? expert_system_text.replace(
            "{human_message}",
            selectedQuestions.conversition[0].human_message
          )
        : history_system_text;

    console.log("request_system_text", request_system_text);
    const result = await model.invoke(request_system_text);
    const parser = new StringOutputParser();
    const llmAnswer = await parser.invoke(result);
    const llmJson = JSON.parse(llmAnswer);
    console.log("llmJson", llmJson);
    let suggestion=[];
    if ((llmJson.describe != null) & (llmJson.describe != "")) {
      suggestion = await getSuggesstion(llmJson.request_type,llmJson.describe.join(","))
      console.log("suggestion",suggestion)
    }
    res.status(200).json(ApiResponse.success(200, "Sonuç Başarılı", {llm_message:llmJson.system_message,suggestion}));
  }
});

const answerTheQuestion = asyncHandler(async (req, res) => {
  const { _id, answer } = req.body;
  const updateConversition = await questions.findOneAndUpdate(
    { _id },
    { answer }
  );
  if (updateConversition) {
    res.status(200).json(ApiResponse.success(200, "Cevap kayıt edildi", {}));
  } else {
    res.status(401).json(ApiResponse.success(401, "Güncelleme Başarısız", {}));
  }
});
const cancelTheQuestion = asyncHandler(async (req, res) => {
  const { _id } = req.body;
  const updateConversition = await questions.findOneAndUpdate(
    { _id },
    { disable: true }
  );
  if (updateConversition) {
    res.status(200).json(ApiResponse.success(200, "Soru kaldırıldı", {}));
  } else {
    res.status(401).json(ApiResponse.success(401, "Güncelleme Başarısız", {}));
  }
});

const getSuggesstion = asyncHandler(async (request_type, describeString) => {
  console.log("request_type, describeString",request_type, describeString)
  const vectorResponse = await axios.post(process.env.VECTOR_URI, {
    text: describeString,
  });
 
  const describeVector = vectorResponse.data.vektor;
  console.log("describeVector",describeVector)
  if (request_type == "services") {
    const result = await company.aggregate([
      {
        "$vectorSearch": {
          "index": "tinten_companies_vector_index",
          "path": "vector",
          "queryVector": describeVector,
          "numCandidates": 50,
          "limit": 10
        }
      }
    ]);
    console.log("result",result)
    return result;
  }
});
module.exports = {
  describe,
  answerTheQuestion,
  cancelTheQuestion,
};
/*
  {
        $search: {
          knnBeta: {
            vector: describeVector,
            path: "vector", // Veri tabanınızdaki gerçek alan adı
            k: 3,
          },
        },
      },*/
/*   const promptTemplate = ChatPromptTemplate.fromMessages([
      ["system", system_message],
    ]);
    
    const promt = await promptTemplate.invoke({ human_message});
    console.log("result",promt)
   */

/*   console.log("system_message", system_message);
    console.log("human_message", human_message);
  
    const promptTemplate = PromptTemplate.fromTemplate(system_message);
    await promptTemplate.invoke({ human_message });
    console.log("promptTemplate",promptTemplate)
  
   */
