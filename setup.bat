@echo off
REM Claude Code dotfiles セットアップスクリプト (Windows)
REM %USERPROFILE%\.claude\ 配下にシンボリックリンクを作成する
REM 管理者権限で実行すること

setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"
set "CLAUDE_DIR=%USERPROFILE%\.claude"

REM リンク対象の定義
call :link_file "CLAUDE-global.md" "CLAUDE.md"
call :link_file "settings.json" "settings.json"
call :link_dir "skills" "skills"
call :link_dir "agents" "agents"
call :link_dir "rules" "rules"
call :link_dir "hooks" "hooks"

echo.
echo セットアップ完了
goto :eof

:link_file
set "SRC=%SCRIPT_DIR%%~1"
set "DST=%CLAUDE_DIR%\%~2"

if not exist "%SRC%" (
    echo SKIP: %SRC% が存在しません
    goto :eof
)

if exist "%DST%" (
    REM シンボリックリンクかどうか判定
    fsutil reparsepoint query "%DST%" >nul 2>&1
    if !errorlevel! equ 0 (
        echo REMOVE: 既存のシンボリックリンク %DST%
        del "%DST%"
    ) else (
        set "TIMESTAMP=%date:~0,4%%date:~5,2%%date:~8,2%%time:~0,2%%time:~3,2%%time:~6,2%"
        set "TIMESTAMP=!TIMESTAMP: =0!"
        echo BACKUP: %DST% -^> %DST%.bak.!TIMESTAMP!
        move "%DST%" "%DST%.bak.!TIMESTAMP!" >nul
    )
)

echo LINK: %SRC% -^> %DST%
mklink "%DST%" "%SRC%" >nul
goto :eof

:link_dir
set "SRC=%SCRIPT_DIR%%~1"
set "DST=%CLAUDE_DIR%\%~2"

if not exist "%SRC%" (
    echo SKIP: %SRC% が存在しません
    goto :eof
)

if exist "%DST%" (
    fsutil reparsepoint query "%DST%" >nul 2>&1
    if !errorlevel! equ 0 (
        echo REMOVE: 既存のシンボリックリンク %DST%
        rmdir "%DST%"
    ) else (
        set "TIMESTAMP=%date:~0,4%%date:~5,2%%date:~8,2%%time:~0,2%%time:~3,2%%time:~6,2%"
        set "TIMESTAMP=!TIMESTAMP: =0!"
        echo BACKUP: %DST% -^> %DST%.bak.!TIMESTAMP!
        move "%DST%" "%DST%.bak.!TIMESTAMP!" >nul
    )
)

echo LINK: %SRC% -^> %DST%
mklink /D "%DST%" "%SRC%" >nul
goto :eof
