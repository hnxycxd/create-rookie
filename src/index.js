#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

// 转换fs的回调函数API为Promise API
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
const mkdir = promisify(fs.mkdir)
const copyFile = promisify(fs.copyFile)

// 递归函数来复制文件夹及其内容
async function copyFolderRecursive(source, target) {
  const entries = await readdir(source, { withFileTypes: true })

  await Promise.all(
    entries.map(async (entry) => {
      const srcPath = path.join(source, entry.name)
      const destPath = path.join(target, entry.name)

      if (entry.isDirectory()) {
        // 递归复制文件夹
        await mkdir(destPath, { recursive: true })
        await copyFolderRecursive(srcPath, destPath)
      } else {
        // 复制文件
        await copyFile(srcPath, destPath)
      }
    })
  )
}

// 异步函数来启动复制过程
async function copyFolder(sourceFolderPath, currentWorkingDirectory) {
  try {
    // 目标文件夹路径为当前工作目录中的同名文件夹（或指定名称）
    // 你可以根据需要修改这里的逻辑，比如不创建同名文件夹，而是直接在当前目录下复制
    const destFolderPath = path.join(currentWorkingDirectory, path.basename(sourceFolderPath))

    // 确保目标文件夹存在
    await mkdir(destFolderPath, { recursive: true })

    // 复制文件夹及其内容
    await copyFolderRecursive(sourceFolderPath, destFolderPath)

    console.log(`Copied ${sourceFolderPath} to ${destFolderPath}`)
  } catch (error) {
    console.error('Error copying folder:', error)
  }
}

// 调用函数
const sourceFolderPath = path.join(__dirname, './template-node-ts')
const currentWorkingDirectory = process.cwd()
copyFolder(sourceFolderPath, currentWorkingDirectory)
