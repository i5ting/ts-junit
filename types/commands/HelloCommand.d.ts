import { Command } from 'clipanion';
export declare class HelloCommand extends Command {
  name: string;
  execute(): Promise<void>;
}
