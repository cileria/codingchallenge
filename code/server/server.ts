import express, { Request, Response } from "express";
import { aiTask, AIModel } from "./ai";
import cors from "cors";
import session from "express-session";
import { q } from "./tools";
import fse from "fs-extra";

const cfg = require("./backend.json");
const server = express();

server.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(
  session({
    secret: "some secret",
    resave: false,
    saveUninitialized: false,
  })
);

interface IAIPrompt {
  id: string;
  result: string;
}

const randomString = (length: number): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

const saveAIPrompts = async (aiPrompts: IAIPrompt[]) => {
  try {
    await fse.writeFile(
      `${__dirname}/aiprompts.json`,
      JSON.stringify(aiPrompts)
    );

    return;
  } catch (e) {
    throw e;
  }
};

const saveAIPrompt = async (aiPrompt: IAIPrompt) => {
  try {
    const aiPromptsRaw = await fse.readFile(
      `${__dirname}/aiprompts.json`,
      "utf-8"
    );
    const aiPrompts = JSON.parse(aiPromptsRaw);
    aiPrompts.push(aiPrompt);
    await fse.writeFile(
      `${__dirname}/aiprompts.json`,
      JSON.stringify(aiPrompts)
    );

    return;
  } catch (e) {
    throw e;
  }
};

const loadAIPrompts = async () => {
  try {
    const aiPromptsRaw = await fse.readFile(
      `${__dirname}/aiprompts.json`,
      "utf-8"
    );
    const aiPrompts = JSON.parse(aiPromptsRaw) as IAIPrompt[];

    return aiPrompts;
  } catch (e) {
    throw e;
  }
};

server.get("/", (req: Request, res: Response) => {
  return res.send({
    errorId: 0,
    codeChallenge: 1.0,
  });
});

server.post("/aiprompt", async (req: Request, res: Response) => {
  try {
    let { prompt } = req.body;

    if (!prompt) {
      const error = {
        errorId: 1003,
        message: "No Prompt found, please add one",
      };
      q("some user", error);
      return res.send(error);
    }

    try {
      const result = await aiTask(AIModel.GPT35, prompt);

      const aiPrompt = { id: randomString(10), result };
      await saveAIPrompt(aiPrompt);

      return res.send({
        errorId: 0,
        result: aiPrompt,
      });
    } catch (e) {
      return res.send({
        errorId: 1009,
        title: "AI query could not get an answer",
        message: e as string,
      });
    }
  } catch (e) {
    const error = { errorId: 2000, message: e as string };
    q(req.ip, error);
    return res.send(error);
  }
});

server.get("/aiprompts", async (req: Request, res: Response) => {
  try {
    try {
      const aiPrompts = await loadAIPrompts();
      return res.send({
        errorId: 0,
        result: aiPrompts,
      });
    } catch (e) {
      return res.send({
        errorId: 1009,
        title: "Could not load AI requests",
        message: e as string,
      });
    }
  } catch (e) {
    const error = { errorId: 2000, message: e as string };
    q(req.ip, error);
    return res.send(error);
  }
});

server.delete("/aiprompt/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    try {
      let aiPrompts = await loadAIPrompts();
      aiPrompts = aiPrompts.filter((aip) => aip.id !== id);
      await saveAIPrompts(aiPrompts);
      return res.send({
        errorId: 0,
        result: aiPrompts,
      });
    } catch (e) {
      return res.send({
        errorId: 1009,
        title: "Could not load AI requests",
        message: e as string,
      });
    }
  } catch (e) {
    const error = { errorId: 2000, message: e as string };
    q(req.ip, error);
    return res.send(error);
  }
});

server.listen(cfg.port, (err?: unknown) => {
  if (err) throw err;
  q("admin", `> Coding Challenge Server ready on ${cfg.backend}`);
});
