const { SlashCommandBuilder, InteractionCollector } = require("discord.js");
const {GoogleGenerativeAI} = require('@google/generative-ai')
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });





module.exports = {
  data: new SlashCommandBuilder()
    .setName("gpt")
    .setDescription("replies with result from the api")
    .addStringOption((option) =>
      option.setName("prompt")
        .setDescription("to be sent to the api")
        .setRequired(true)
    ),
  async execute(interaction) {
        await interaction.deferReply();
   
        
        try {

            const chat = model.startChat({
                history: [
                  {
                    role: "user",
                    parts: [{ text: "You are a bot in a discord server " }],
                  },
                  {
                    role: "model",
                    parts: [{ text: "im a discord bot in a server" }],
                  },
                ],
                generationConfig: {
                  maxOutputTokens: 1000,
                },
              });
            const prompt = interaction.options.getString("prompt");
            const result = await chat.sendMessage(prompt);
            console.log(result.response.text());
            await interaction.editReply(prompt+'\n'+result.response.text());
            
        } catch (error) {
            console.error(error)
        }
    
  },
};
