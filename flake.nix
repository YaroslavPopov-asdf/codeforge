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
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_22
            go
            gcc
            rustc
            cargo
            docker
            docker-compose
          ];

          shellHook = ''
            echo "CodeForge dev environment"
            echo "Node: $(node --version)"
            echo "Go: $(go version)"
            echo "GCC: $(gcc --version | head -1)"
            echo "Rust: $(rustc --version)"
            echo "Docker: $(docker --version 2>/dev/null || echo 'Docker daemon not running')"
          '';
        };
      });
}
