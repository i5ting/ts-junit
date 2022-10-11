import { BaseCommand } from './BaseCommand';
export declare class MainCommand extends BaseCommand {
  fileOrDir: any;
  execute(): Promise<void>;
  isFile(): any;
  runFile(): Promise<void>;
  runDir(): Promise<void>;
}
