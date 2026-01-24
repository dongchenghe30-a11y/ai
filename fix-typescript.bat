@echo off
REM Windows批处理脚本 - 快速修复TypeScript错误
REM 使用方法: fix-typescript.bat

echo 🔧 开始修复TypeScript错误...
echo.

REM 检查是否在项目根目录
if not exist "package.json" (
    echo ❌ 错误: 请在项目根目录下运行此脚本
    pause
    exit /b 1
)

REM 1. 安装axios类型声明
echo 📦 安装@types/axios...
call npm install --save-dev @types/axios

if %errorlevel% neq 0 (
    echo ❌ @types/axios 安装失败
    pause
    exit /b 1
)

echo ✅ @types/axios 安装成功
echo.

REM 2. 创建Vite环境变量类型声明文件
echo 📝 创建vite-env.d.ts文件...
(
    echo /// ^<reference types="vite/client" /^>
    echo.
    echo interface ImportMetaEnv {
    echo   readonly VITE_API_URL: string
    echo }
    echo.
    echo interface ImportMeta {
    echo   readonly env: ImportMetaEnv
    echo }
) > src\vite-env.d.ts

if exist "src\vite-env.d.ts" (
    echo ✅ vite-env.d.ts 文件创建成功
) else (
    echo ❌ vite-env.d.ts 文件创建失败
    pause
    exit /b 1
)

echo.

REM 3. 验证TypeScript编译
echo 🔍 验证TypeScript编译...
call npx tsc --noEmit

if %errorlevel% equ 0 (
    echo.
    echo 🎉 所有TypeScript错误已修复!
    echo ✅ 代码编译成功
) else (
    echo.
    echo ⚠️ 还有其他TypeScript错误需要手动修复
)

echo.
echo 修复完成!
pause
