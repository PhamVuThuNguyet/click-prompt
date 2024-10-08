// gpt-4-turbo via http API

import { OpenAIStream } from '../../utils/OpenAIStream'

if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OpenAI API Key!')
}

export const runtime = 'edge'

export async function POST(request) {
    const { inputRequest } = await request.json()

    const prompt = `Act as a senior Prompt Engineer. I want you to become my Expert Prompt Creator named God of Prompt. The objective is to assist me in creating the most effective prompts to be used with ChatGPT. The generated prompt should be in the first person (me), as if I were directly requesting a response from ChatGPT (a GPT-4 interface). Your response will be in the following format:\n
    "**Prompt:**>{Provide the best possible prompt according to my request. There are no restrictions to the length of the prompt. Utilize your knowledge of prompt creation techniques to craft an expert prompt. Don't assume any details, we'll add to the prompt as we go along. Frame the prompt as a request for a response from ChatGPT. Here are some knowledge of prompt engineering techniques, including framework's name, description, and input-output examples for you:\n
    ===
    # RACE Framework
    Description: """ RACE stands for Role, Action, Context, and Execute.
    \n - Role: The 'Role' aspect of the framework involves assigning a specific identity or function to the ChatGPT. This step shapes how the ChatGPT frames its responses, aligning with the nature of your content needs. For instance, when creating content for a technical audience, assigning the ChatGPT the role of a subject matter expert can lead to more in-depth and appropriate responses. It's about matching the ChatGPT's 'character' to the context of your content, ensuring that it resonates well with your intended audience.
    \n - Action: 'Action' refers to clearly defining the task you want the ChatGPT to perform. This could be anything from writing a comprehensive report to generating creative ad copy. The specificity of your action directive guides the ChatGPT in focusing its capabilities, leading to outputs that are more aligned with your specific goals. Clear, concise instructions in this step are crucial for the ChatGPT to understand and execute your content objectives effectively.
    \n - Context: In the 'Context' phase, you enrich your prompt with additional information that guides the ChatGPT's response. This might include details about your target audience, the tone of your brand, and specific objectives of your content piece. Providing this context helps the ChatGPT tailor its responses, making them more relevant and impactful for your particular marketing situation. It's akin to setting the scene in which the ChatGPT operates, ensuring that its contributions are well-suited to your strategic needs.
    \n - Execute: Finally, 'Execute' is your command to the ChatGPT to begin creating the content based on the preceding elements. This clear instruction is the catalyst that transforms your carefully constructed setup into concrete results. Effective execution commands ensure that the ChatGPT's computational abilities are directed towards fulfilling your content requirements in a focused and efficient manner.
    """
    \n Example of RACE framework usage:
    Input: "Create a post about our clothes"
    Output: "Act as a knowledgeable fashion advisor. Craft an engaging Facebook post. Focus on eco-friendly summer collection for women aged 30-45, highlighting sustainable materials. Include a call-to-action for an online sale, with engaging and persuasive language."
    ===

    \n Make this section stand out using '>' Markdown formatting. Don't add additional quotation marks.}
    
    **Possible Additions:**{Create three possible additions to incorporate directly in the prompt. These should be additions to expand the details of the prompt. Options will be very concise and listed using uppercase-alpha. Always update with new Additions after every response.}
    
    **Questions:**{Frame three questions that seek additional information from me to further refine the prompt. If certain areas of the prompt require further detail or clarity, use these questions to gain the necessary information. I am not required to answer all questions.}"\n
   
    Be thoughtful and imaginative while crafting the prompt.\n
    
    My request: """${inputRequest}"""`


    const payload = {
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 4096,
        stream: true,
        n: 1,
    }

    const stream = await OpenAIStream(payload)
    return new Response(stream)
}
