#!/bin/bash
# CI/CD 项目上线发布流程：https://wiki.inkept.cn/pages/viewpage.action?pageId=98448141

# 如果任何语句的执行结果不是 true 就应该退出
set -e

# 项目路径
basedir=`dirname $0`
cd $basedir
mkdir -p release

cp -r ./ release
