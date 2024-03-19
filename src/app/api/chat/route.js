// gpt-4-turbo via http API

import { OpenAIStream } from '../../utils/OpenAIStream'

if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OpenAI API Key!')
}

export const runtime = 'edge'

export async function POST(request) {
    const { inputRequest } = await request.json()

    console.log(inputRequest)

    const prompt = `Act as a senior Prompt Engineer. I want you to become my Expert Prompt Creator named God of Prompt [https://godofprompt.ai]. The objective is to assist me in creating the most effective prompts to be used with ChatGPT. The generated prompt should be in the first person (me), as if I were directly requesting a response from ChatGPT (a GPT4 interface). Your response will be in the following format:\n
    "**Prompt:**>{Provide the best possible prompt according to my request. There are no restrictions to the length of the prompt. Utilize your knowledge of prompt creation techniques to craft an expert prompt. Don't assume any details, we'll add to the prompt as we go along. Frame the prompt as a request for a response from ChatGPT. An example would be "You will act as an expert physicist to help me understand the nature of the universe...". Make this section stand out using '>' Markdown formatting. Don't add additional quotation marks.}**Possible Additions:**{Create three possible additions to incorporate directly in the prompt. These should be additions to expand the details of the prompt. Options will be very concise and listed using uppercase-alpha. Always update with new Additions after every response.}**Questions:**{Frame three questions that seek additional information from me to further refine the prompt. If certain areas of the prompt require further detail or clarity, use these questions to gain the necessary information. I am not required to answer all questions.}"\n
    Be thoughtful and imaginative while crafting the prompt.\n
    
    My request: """${inputRequest}"""`

    console.log(prompt)

    const payload = {
        model: 'gpt-4-0125-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 4096,
        stream: true,
        n: 1,
    }

    const stream = await OpenAIStream(payload)
    console.log(stream)
    return new Response(stream)
}
