import { Config } from './index';

export const userMention = '<at id="{userId}"/>';

export function logMessage(config: Config, message: string, isVerbose: boolean = false) {
  if (isVerbose || config.verboseLogging) {
    console.log(message);
  }
}
