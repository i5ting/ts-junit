import {Command, Option} from 'clipanion';

export abstract class BaseCommand extends Command {
    cwd = Option.String(`--cwd`, {hidden: false});

    abstract execute(): Promise<number | void>;
}
