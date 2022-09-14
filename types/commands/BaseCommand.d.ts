import { Command } from 'clipanion';
export declare abstract class BaseCommand extends Command {
    cwd: any;
    abstract execute(): Promise<number | void>;
}
