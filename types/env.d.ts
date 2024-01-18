interface Env {
	PORT: string;
  TARGET_DIRECTORY: string
}

declare global {
	namespace NodeJS {
		interface ProcessEnv extends Env {}
	}
}

export {};
