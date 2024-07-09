import { Configuration, OpenAIApi } from "openai";
import { q } from "./tools";
const cfg = require("./backend.json");

const configuration = new Configuration({
  apiKey: cfg.openAIKey,
});

const openai = new OpenAIApi(configuration);

export enum AIModel {
  GPT3,
  GPT35,
  GPT4,
}

export async function aiTask(aiModel: AIModel, prompt: string) {
  const timeout = new Promise((_, reject) =>
    setTimeout(
      () =>
        reject(
          new Error(
            `Request timeout after ${cfg.timeoutAIRequestMinutes} minutes`
          )
        ),
      cfg.timeoutAIRequestMinutes * 1000 * 60
    )
  );

  try {
    const completionPromise =
      aiModel === AIModel.GPT3
        ? openai.createCompletion({
            max_tokens: 1500,
            model: "text-davinci-003",
            prompt,
          })
        : openai.createChatCompletion({
            model:
              aiModel === AIModel.GPT35
                ? "gpt-3.5-turbo-1106"
                : "gpt-4-1106-preview",
            messages: [{ role: "user", content: prompt }],
          });

    const completion = (await Promise.race([
      completionPromise,
      timeout,
    ])) as any;

    return aiModel === AIModel.GPT3
      ? completion.data.choices[0].text
      : completion.data.choices[0].message?.content;
  } catch (e) {
    throw e;
  }
}

export async function aiTaskFlexible(
  aiModel: AIModel,
  prompt: string,
  maxNumTries: number,
  onRetry: () => void
) {
  let numTries = 0;
  let result: string | null = null;
  while (numTries < maxNumTries) {
    try {
      q("", `Currently running AI task with attempt number ${numTries} ...`);
      result = await aiTask(aiModel, prompt);

      if (result) return result;

      onRetry();
      numTries++;
    } catch (e) {
      onRetry();
      numTries++;
    }
  }

  if (numTries >= maxNumTries) {
    return null;
  }

  return result;
}
