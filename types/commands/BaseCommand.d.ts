import { Command } from 'clipanion';
export declare abstract class BaseCommand extends Command {
    cwd: string;
    abstract execute(): Promise<number | void>;
}
