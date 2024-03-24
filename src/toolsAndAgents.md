### use case:
lets say I run an e-commerce website and
I have employees who need answers (ex: how many orders have we had today?)
we could build a dashboard to answer these questions,
but each question they have would require a unique query
so we could use a chatbot to answer these questions

### implementation:
In each prompt we give the LLM knowledge of how to access the DB
The LLM will then query the DB to get the answer (using SQL)
Then returns the answer to the user

### step 1:
User submits a question: "How many orders have we had today?"

### step 2:
- creating a tool
- we need to create a function that will run a query on the DB
- we need to pass the `runQuery` function to the model so it can call it
- We can call this function anything we want

### step 3:
- create an agent & agent executor
- the agent will be responsible for calling the `runQuery` function
- an agent (in Langchain) is a chain that can accept & run tools
- the agent executor is essentially a loop that will keep calling the LLM until the response is no longer a request to run a tool

### step 2:
- merge the user's quesiton with instructions on how to use a 'tool'
- it would also be helpful to give the LLM the DB table & column names
- instead of directly giving the LLM a list of all the columns
- we can give the LLM a list of all the tables & a tool to get the columns of a table
- that way it can make more accurate queries
- sometimes the LLM will make assumptions instead of using the tools we give it
- so we need to specifically tell it in the SystemMessage not to make assumptions
- and use the `get_columns` tool

```javascript
  const tools = {
    run_query: (query) => {
      // run the query
    },
    get_columns: (table) => {
      // get the columns of a table
    },
    write_html_report: (filename, html) => {
      // write an html report to disk
      // should be formatted as a table
    }
  }
  const message = [
    new SystemMessage(
      `
        You are an AI that can access a sqlite database:
        the available tables in the database are: orders, customers, products
        Do not make assumptions about what tables & columns exist, use the get_columns tool
      `
    ),
    new UserMessage("How many orders have we had today?"),
  ]
```

Tell the model:
```json
  You have access to the following tools:
  - run_query: runs a sqlite query and returns the result.
  Accepts an argument of a sql query as a string

  To use a tool always respond with the following format:
  {
    "name": <name of tool to use>,
    "argument": <argument to pass to the tool>
  }
```

- step 2 can be simplified with 'ChatGPT Functions'
- ChatGPT Functions is better because we don't use extra tokens to tell the model about the tools
- also the functions ensure we get JSON back from the model
- before GPT funcs existed the LLM wouln't always return JSON

example of using GPT funcs:
```json
  messages = [
    {"role": "user", "content": "How many orders have we had today?"},
  ]
  functions = [
    {
      "name": "run_query",
      "description": "runs a sqlite query and returns the result",
      "parameters": {
        "type": "object",
        "properties": {
          "query": {
            "type": "string",
            "description": "a sql query to run"
          }
        }
      }
    }
  ]
```

### step 3:
LLM decides in needs to use a tool to answer the question
LLM responds with the following:
```json
  {
    "name": "run_query",
    "argument": "SELECT COUNT(*) FROM orders WHERE date = '2022-01-01'"
  }
```

### step 4:
our application code will intercept the response and run the query

### step 5:
send the result of the query back to the LLM

### step 6:
- Error handling
- if the query fails we can send that error message back to the LLM
- the LLM can then try to fix the error and run the query again

### step 6:
LLM responds with the answer to the user
"We have had 5 orders today"

### step 7:
User is happy and continues to ask questions