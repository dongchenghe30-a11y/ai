#!/bin/bash

# 快速修复TypeScript错误的脚本
# 使用方法: bash fix-typescript.sh

echo "🔧 开始修复TypeScript错误..."
echo ""

# 检查是否在项目根目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在项目根目录下运行此脚本"
    exit 1
fi

# 1. 安装axios类型声明
echo "📦 安装@types/axios..."
npm install --save-dev @types/axios

if [ $? -eq 0 ]; then
    echo "✅ @types/axios 安装成功"
else
    echo "❌ @types/axios 安装失败"
    exit 1
fi

echo ""

# 2. 创建Vite环境变量类型声明文件
echo "📝 创建vite-env.d.ts文件..."
cat > src/vite-env.d.ts << 'EOF'
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
EOF

if [ -f "src/vite-env.d.ts" ]; then
    echo "✅ vite-env.d.ts 文件创建成功"
else
    echo "❌ vite-env.d.ts 文件创建失败"
    exit 1
fi

echo ""

# 3. 验证TypeScript编译
echo "🔍 验证TypeScript编译..."
npx tsc --noEmit

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 所有TypeScript错误已修复!"
    echo "✅ 代码编译成功"
else
    echo ""
    echo "⚠️  还有其他TypeScript错误需要手动修复"
fi

echo ""
echo "修复完成!"
