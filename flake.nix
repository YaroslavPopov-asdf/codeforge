{
  description = "CodeForge - learn C, C++, Rust";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        prismaEngines = pkgs.prisma-engines;
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [ nodejs_22 pnpm prisma-engines openssl ];
          shellHook = ''
            export PRISMA_SCHEMA_ENGINE_BINARY="${prismaEngines}/bin/schema-engine"
            export PRISMA_QUERY_ENGINE_BINARY="${prismaEngines}/bin/query-engine"
            export PRISMA_QUERY_ENGINE_LIBRARY="${prismaEngines}/lib/libquery_engine.so"
            export PRISMA_CLI_QUERY_ENGINE_TYPE="library"
          '';
        };

        devShells.runner = pkgs.mkShell {
          buildInputs = with pkgs; [ go gcc rustc cargo openssl ];
          shellHook = ''
            echo "Runner dev environment"
            echo "Go: $(go version)"
          '';
        };
      });
}
