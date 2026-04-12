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
call :link_dir "agents" "agents"
call :link_dir "rules" "rules"
call :link_dir "hooks" "hooks"

REM skills は個別リンク（skills CLI 等との共存のため）
call :link_skills_individually

echo.
echo セットアップ完了
goto :eof

:link_skills_individually
set "SKILLS_SRC=%SCRIPT_DIR%skills"
set "SKILLS_DST=%CLAUDE_DIR%\skills"

if not exist "%SKILLS_SRC%" (
    echo SKIP: %SKILLS_SRC% が存在しません
    goto :eof
)

REM 既存の %SKILLS_DST% がシンボリックリンクの場合は削除（旧構成からの移行）
if exist "%SKILLS_DST%" (
    fsutil reparsepoint query "%SKILLS_DST%" >nul 2>&1
    if !errorlevel! equ 0 (
        echo REMOVE: 既存のシンボリックリンク %SKILLS_DST%（旧構成）
        rmdir "%SKILLS_DST%"
    )
)

REM %SKILLS_DST% を実ディレクトリとして作成
if not exist "%SKILLS_DST%" mkdir "%SKILLS_DST%"

REM skills\ 配下の各ディレクトリを個別にリンク
for /d %%D in ("%SKILLS_SRC%\*") do (
    set "SKILL_SRC=%%D"
    set "SKILL_NAME=%%~nxD"
    set "SKILL_DST=%SKILLS_DST%\!SKILL_NAME!"

    if exist "!SKILL_DST!" (
        fsutil reparsepoint query "!SKILL_DST!" >nul 2>&1
        if !errorlevel! equ 0 (
            echo REMOVE: 既存のシンボリックリンク !SKILL_DST!
            rmdir "!SKILL_DST!"
        ) else (
            set "TIMESTAMP=%date:~0,4%%date:~5,2%%date:~8,2%%time:~0,2%%time:~3,2%%time:~6,2%"
            set "TIMESTAMP=!TIMESTAMP: =0!"
            echo BACKUP: !SKILL_DST! -^> !SKILL_DST!.bak.!TIMESTAMP!
            move "!SKILL_DST!" "!SKILL_DST!.bak.!TIMESTAMP!" >nul
        )
    )

    echo LINK: !SKILL_SRC! -^> !SKILL_DST!
    mklink /D "!SKILL_DST!" "!SKILL_SRC!" >nul
)
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
