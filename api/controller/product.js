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
const searchProduct = asyncHandler(async (req, res) => {
    const { message } = req.body
    const model = new ChatOpenAI({ model: "gpt-4o-mini",temperature: 0 });
    const messages = [
        new SystemMessage(`
    Sen bir yardımcı asistansın ve kullanıcıdan gelen doğal dildeki isteği analiz etmen gerekiyor. Görevin aşağıdaki adımları içeriyor:

    1. Kullanıcının isteğinin bir ürün mü yoksa bir hizmet mi olduğunu anla. Bu sonucu istek tipi altında ürün veya hizmet başlığı olarak ayır.
    2. Kullanıcının isteğini anla ve hangi meslek veya hizmeti aradığını belirle. Meslek seçimi genel ve kapsayıcı olsun.
    3. İstenen meslek veya hizmetin alt kategorilerini veya spesifik alanlarını tespit et.
    4. Eğer bilgi eksikse veya belirsizlik varsa, kullanıcıya netleştirici bir soru sormak üzere uygun bir soru oluştur ve belirsizlik giderilene kadar kullanıcıdan bilgi almaya devam et.
    5. Bu işle ilgili olabilecek başka iş kollarını bul ve bu iş kollarına da ihtiyacı oluş olmadığını sor.
    6. Sonuçları yapılandırılmış bir formatta sun:
       - Istek tipi:
       Eğer istek Ürün ise ->
       - Ürün başlığı:
       - Ürünü filtrelemek için gerekli Ek Soru (varsa):
       - ilgili ürünleri (varsa): 
       Eğer istek Hizmet ise ->
    - Meslek/Hizmet:
    - Alt Kategori/Uzmanlık:
    - Ek Soru (varsa):
    - ilgili iş kolu (varsa):
    - ilgili ürünleri (varsa):
    Eğer istek Hizmet veya Ürün değil ise ->
    - Ek Soru (varsa):  
    7.Aşağıdaki kurallara uymalısın:
     -Sadece hizmetler ve firmalar hakkında bilgi ver.
     -İlgi alanın ışında kalan konularda sohbet etme. 
     -Eğer kullanıcı farklı bir konuya yönelirse, nazikçe asıl amaca odaklanmasını sağla. 
     -Kullanıcıyı kırmadan ve saygılı bir şekilde yönlendir. 

     8. kullanıcıdan istemen gereken ek bilgiler varsa onlarıda iste.
    Eğer istek Hizmet ise ->
     -Bu hizmetin gerçekleşmesi için bir lokasyon bilgisi gerekiyorsa lokasyon bilgisini öğren
     Eğer istek Ürün ise ->
     -Gönderim yapılacak yerin adresini iste
    Kullanıcının isteği: "{user_prompt}"
    `),
        new HumanMessage(message),
    ];
    const trimmed = await trimMessages(messages, {
        maxTokens: 45,
        strategy: "last",
        tokenCounter: model,
      });
      console.log(
        trimmed
          .map((x) =>
            JSON.stringify(
              {
                role: x._getType(),
                content: x.content,
              },
              null,
              2
            )
          )
          .join("\n\n")
      );
    const result = await model.invoke(messages);
    const parser = new StringOutputParser();
    res.status(200).json({ message: await parser.invoke(result), data: result });
});



// Tüm performans sanatçılarını getirme işlemi
const makingVector = asyncHandler(async (req, res) => {
  const { message } = req.body

 
  res.status(200).json({ message: await parser.invoke(result), data: result });
});




module.exports = {
    searchProduct,makingVector
};