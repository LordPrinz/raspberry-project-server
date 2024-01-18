interface Env {
	PORT: string;
	UDP_PORT: string;
}

declare global {
	namespace NodeJS {
		interface ProcessEnv extends Env {}
	}
}

export {};
