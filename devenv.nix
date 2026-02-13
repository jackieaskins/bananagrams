# See full reference at https://devenv.sh/reference/options/

{ pkgs, ... }:
{
  languages = {
    javascript = {
      enable = true;

      package = pkgs.nodejs-slim_20;

      npm = {
        enable = true;
        install.enable = true;
      };
    };

    python.enable = true; # Needed for node-canvas install
    typescript.enable = true;
  };

  # Dependencies for node-canvas install
  packages = [
    pkgs.cairo
    pkgs.pango
    pkgs.pixman
  ];
}
