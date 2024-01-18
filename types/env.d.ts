interface Env {
	PORT: string;
}

declare global {
	namespace NodeJS {
		interface ProcessEnv extends Env {}
	}
}

export {};
