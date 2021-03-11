import { BaseCommand } from './BaseCommand';
export declare class MainCommand extends BaseCommand {
    fileOrDir: string;
    execute(): Promise<void>;
    runFile(): Promise<void>;
    runDir(): Promise<void>;
}
