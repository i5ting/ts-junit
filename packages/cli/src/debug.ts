import { Debug } from "@ts-junit/utils";

type debug = (name: string) => void;

export const debug: debug = Debug("@ts-junit/cli");
