// https://js.langchain.com/docs/modules/model_io/chat/quick_start
import { ChatOllama } from '@langchain/community/chat_models/ollama';
import { TextLoader } from "langchain/document_loaders/fs/text";
import {
  HumanMessage, SystemMessage, AIMessage
} from '@langchain/core/messages';
import prompts from 'prompts';

const model = new ChatOllama({
  model: 'gemma:2b',
  // cache: true,
});

const messages = [
  // sets the theme of the chat
  new SystemMessage("You're a helpful assistant"),
];

const run = async () => {
  const loader = new TextLoader("src/facts.txt");
  const docs = await loader.load();
  // separate the doc into chunks using langchain text splitter
  // use chunk size of 200 & separator of '\n'
  // the text splitter will turn each chunk into a `new Document()`

  // calculate embeddings for each chunk
  // there are multiple ways to calculate embeddings
  // could use SentenceTransformer (free), or OpenAI embeddings (cost), or other embeddings

  // store the embeddings in a database

  console.log('What can I help you with? (Type "exit" to quit)')

  let exit = false;
  while (!exit) {
    const userInput = await prompts({
      type: 'text',
      name: 'value',
      message: '>>',
    });

    if (!userInput?.value || userInput.value.toLowerCase() === 'exit') {
      exit = true;
      break;
    }

    messages.push(new HumanMessage(userInput.value));

    // const modelResp = await model.invoke(messages);
    const stream = await model.stream(messages);

    let modelResp = '';
    for await (const chunk of stream) {
      process.stdout.write(String(chunk.content));
      modelResp += chunk;
    }

    console.log('\n');
    messages.push(new AIMessage(modelResp));
  }
};

run();
