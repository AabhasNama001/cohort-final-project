const { StateGraph, MessagesAnnotation } = require("@langchain/langgraph");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { ToolMessage } = require("@langchain/core/messages");
const tools = require("./tools");

// Use stable model string for 2026
const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  temperature: 0.3, // Lower temperature for more reliable tool calling
});

// Bind tools to the model
const modelWithTools = model.bindTools([
  tools.searchProduct,
  tools.addProductToCart,
]);

const graph = new StateGraph(MessagesAnnotation)
  .addNode("chat", async (state) => {
    // Invoke the model with current message history
    const response = await modelWithTools.invoke(state.messages);

    // Return to merge the AI message into state
    return { messages: [response] };
  })
  .addNode("tools", async (state, config) => {
    const lastMessage = state.messages[state.messages.length - 1];
    const toolCalls = lastMessage.tool_calls || [];

    const toolResults = await Promise.all(
      toolCalls.map(async (call) => {
        const tool = tools[call.name];
        if (!tool) throw new Error(`Tool ${call.name} not found`);

        const result = await tool.func({
          ...call.args,
          token: config.metadata.token, // Passing token from frontend metadata
        });

        return new ToolMessage({
          content: result,
          tool_call_id: call.id,
        });
      })
    );

    return { messages: toolResults };
  })
  .addEdge("__start__", "chat")
  .addConditionalEdges("chat", (state) => {
    const lastMessage = state.messages[state.messages.length - 1];
    if (lastMessage.tool_calls?.length > 0) {
      return "tools";
    }
    return "__end__";
  })
  .addEdge("tools", "chat");

const agent = graph.compile();

module.exports = agent;
