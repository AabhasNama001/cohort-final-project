const { StateGraph, MessagesAnnotation } = require("@langchain/langgraph");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { ToolMessage, AIMessage } = require("@langchain/core/messages");
const tools = require("./tools");

// 1. Updated to the stable 2026 version: gemini-2.5-flash
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0.5,
});

const graph = new StateGraph(MessagesAnnotation)
  .addNode("tools", async (state, config) => {
    // The last message in a tool-calling flow is the AI Message with tool_calls
    const lastMessage = state.messages[state.messages.length - 1];
    const toolCalls = lastMessage.tool_calls || [];

    const toolCallResults = await Promise.all(
      toolCalls.map(async (call) => {
        const tool = tools[call.name];
        if (!tool) {
          throw new Error(`Tool ${call.name} not found`);
        }

        console.log("Invoking tool:", call.name, "with input:", call.args);

        // Standard tool execution pattern
        const toolResult = await tool.func({
          ...call.args,
          token: config.metadata?.token,
        });

        return new ToolMessage({
          content:
            typeof toolResult === "string"
              ? toolResult
              : JSON.stringify(toolResult),
          tool_call_id: call.id, // CRITICAL: tool_call_id links the result to the call
          name: call.name,
        });
      }),
    );

    // 2. Return the update. MessagesAnnotation uses a reducer that appends
    // these messages to the existing list automatically.
    return { messages: toolCallResults };
  })
  .addNode("chat", async (state) => {
    // Bind tools to the model so it knows it can call them
    const modelWithTools = model.bindTools([
      tools.searchProduct,
      tools.addProductToCart,
    ]);

    // 3. Invoke with the full message history
    const response = await modelWithTools.invoke(state.messages);

    // Return the update to append the AI's response to the state
    return { messages: [response] };
  })
  .addEdge("__start__", "chat")
  .addConditionalEdges("chat", (state) => {
    const lastMessage = state.messages[state.messages.length - 1];

    // Check if the model wants to call tools
    if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
      return "tools";
    }
    return "__end__";
  })
  .addEdge("tools", "chat");

const agent = graph.compile();

module.exports = agent;
