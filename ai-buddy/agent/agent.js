const { StateGraph, MessagesAnnotation } = require("@langchain/langgraph");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { ToolMessage, AIMessage } = require("@langchain/core/messages");
const tools = require("./tools");

// 1. Updated model string to a 2026 stable version
// Gemini-2.0-flash (preview) was deprecated; using stable gemini-1.5-flash
// or the latest gemini-3.0-flash-preview is recommended.
const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  temperature: 0.5,
});

// 2. Pre-binding tools to the model for better schema validation
const modelWithTools = model.bindTools([
  tools.searchProduct,
  tools.addProductToCart,
]);

const graph = new StateGraph(MessagesAnnotation)
  .addNode("tools", async (state, config) => {
    const lastMessage = state.messages[state.messages.length - 1];
    const toolCalls = lastMessage.tool_calls || [];

    const toolResults = await Promise.all(
      toolCalls.map(async (call) => {
        const tool = tools[call.name];
        if (!tool) throw new Error(`Tool ${call.name} not found`);

        console.log(`Invoking tool: ${call.name}`);

        // Ensure tool.func is the execution method defined in your tools file
        const result = await tool.func({
          ...call.args,
          token: config.metadata.token,
        });

        return new ToolMessage({
          content: typeof result === "string" ? result : JSON.stringify(result),
          tool_call_id: call.id, // Mandatory for modern LangChain tool tracking
        });
      })
    );

    // Return the new messages to be merged into the state automatically
    return { messages: toolResults };
  })
  .addNode("chat", async (state) => {
    // Invoke the pre-bound model
    const response = await modelWithTools.invoke(state.messages);

    // LangGraph's MessagesAnnotation handles the "reducer" (merging)
    // simply return the new message object.
    return { messages: [response] };
  })
  .addEdge("__start__", "chat")
  .addConditionalEdges("chat", (state) => {
    const lastMessage = state.messages[state.messages.length - 1];

    // Check if the AI wants to use a tool
    if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
      return "tools";
    }
    return "__end__";
  })
  .addEdge("tools", "chat");

const agent = graph.compile();

module.exports = agent;
