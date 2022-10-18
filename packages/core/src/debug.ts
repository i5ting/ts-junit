import { Debug } from "@ts-junit/utils";

type debug = (name: any) => void;

export const debug: debug = Debug("@ts-junit/cli");
