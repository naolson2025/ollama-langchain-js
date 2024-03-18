import { ChatOllama } from '@langchain/community/chat_models/ollama';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from '@langchain/core/prompts';
import prompts from 'prompts';

const model = new ChatOllama({
  model: 'tinyllama',
});

// const run = async () => {
//   const resp = await chat.invoke(
//     'write a javascript function that adds 2 numbers'
//   );
//   console.log(resp);
// };

// run();
// https://api.js.langchain.com/classes/langchain_core_prompts.HumanMessagePromptTemplate.html
const message = SystemMessagePromptTemplate.fromTemplate('{text}');
const prompt = ChatPromptTemplate.fromMessages([
  ['system', 'You are an expert software engineer.'],
  message,
]);

const run = async () => {
  let exit = false;
  while (!exit) {
    const response = await prompts({
      type: 'text',
      name: 'value',
      message: 'How old are you? (Type "exit" to quit)',
    });

    console.log(response);

    if (response.value.toLowerCase() === 'exit') {
      exit = true;
    }
  }
};

run();
