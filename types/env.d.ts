interface Env {
	PORT: string;
  TARGET_DIRECTORY: string;
	TAG: string
}

declare global {
	namespace NodeJS {
		interface ProcessEnv extends Env {}
	}
}

export {};
