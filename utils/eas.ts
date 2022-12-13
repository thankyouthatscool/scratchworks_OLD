import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

const SERVER_HOST = process.env.SERVER_HOST!;

const updateSecrets = async () => {
  const { stdout } = await execPromise("cd apps/inertiion && eas secret:list");

  const lineArray = stdout.split("\n");

  const nameLineIndex = lineArray.indexOf(
    lineArray.find((line) => line.includes("CLI_TEST"))!
  );

  const idIndex = nameLineIndex - 1;
  const idLine = lineArray[idIndex];
  const secretId = idLine.slice(2).trim();

  const { stdout: secretDeleteOutput } = await execPromise(
    `cd apps/inertiion && eas secret:delete --id ${secretId} --non-interactive`
  );

  console.log(secretDeleteOutput);

  const { stdout: create } = await execPromise(
    `cd apps/inertiion && eas secret:create --scope project --name CLI_TEST --value ${SERVER_HOST}911 --type string --non-interactive`
  );

  console.log(create);
};

updateSecrets();
