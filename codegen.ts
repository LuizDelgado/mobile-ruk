import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:3000/graphql",
  documents: ["src/graphql/**/*.graphql"],
  generates: {
    "src/generated/": {
      preset: "client",
      presetConfig: {
        // mantém o "gql" disponível se você usar em algum lugar no futuro
        gqlTagName: "gql",
      },
      config: {
        useTypeImports: true,
      },
    },
  },
};

export default config;
