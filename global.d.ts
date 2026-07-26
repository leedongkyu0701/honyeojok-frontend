import "@tanstack/react-query";

declare module "*.css";

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      silent?: boolean;
    };
  }
}
