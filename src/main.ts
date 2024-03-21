// https://js.langchain.com/docs/modules/model_io/chat/quick_start
import { ChatOllama } from '@langchain/community/chat_models/ollama';
import {
  HumanMessage, SystemMessage, AIMessage
} from '@langchain/core/messages';
import prompts from 'prompts';

const model = new ChatOllama({
  model: 'gemma:2b',
});

const messages = [
  new SystemMessage("You're a helpful assistant"),
];

const run = async () => {
  console.log('What can I help you with? (Type "exit" to quit)')

  let exit = false;
  while (!exit) {
    const userInput = await prompts({
      type: 'text',
      name: 'value',
      message: '>>',
    });

    if (userInput.value.toLowerCase() === 'exit') {
      exit = true;
      break;
    }

    messages.push(new HumanMessage(userInput.value));

    const modelResp = await model.invoke(messages);
    messages.push(new AIMessage(String(modelResp.content)))
    console.log(modelResp.content);
  }
};

run();
