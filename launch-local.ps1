$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

Start-Process "http://127.0.0.1:4173/"
node .\serve-local.mjs
