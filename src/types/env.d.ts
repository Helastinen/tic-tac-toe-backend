declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;
    MONGODB_TEST_URI: string;
    NODE_ENV: "development" | "production" | "test";
  }
}