const asyncHandler = require("express-async-handler");
const architectExpert = require("./achitecht_expert")

const selectedExpert = asyncHandler(async (profession,conversitionid,expert_message)=>{
    switch (profession) {
        case "Mimarlık":
            return await architectExpert.getExpertSuggest(conversitionid,expert_message)
    
        default:
            break;
    }
})
module.exports = selectedExpert