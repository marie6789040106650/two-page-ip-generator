#!/bin/bash

# 快速回滚脚本
echo "🔄 快速回滚选项:"
echo "1. 回滚最后一次提交"
echo "2. 回滚到指定提交"
echo "3. 只回滚特定文件"
echo "4. 查看修改历史"

read -p "请选择 (1-4): " choice

case $choice in
  1)
    echo "回滚最后一次提交..."
    git reset --hard HEAD~1
    ;;
  2)
    git log --oneline -10
    read -p "输入要回滚到的提交hash: " commit_hash
    git reset --hard $commit_hash
    ;;
  3)
    git diff --name-only
    read -p "输入要回滚的文件路径: " file_path
    git checkout HEAD -- $file_path
    ;;
  4)
    git log --oneline -20
    ;;
  *)
    echo "无效选择"
    ;;
esac