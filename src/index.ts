import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const copyRecursion = (templateDir: string, destDir: string) => {
  const fileList = fs.readdirSync(templateDir, { withFileTypes: true })

  fileList.forEach((file) => {
    const template = path.join(templateDir, file.name)
    const dest = path.join(destDir, file.name)

    if (file.isDirectory()) {
      fs.mkdirSync(dest, { recursive: true })
      copyRecursion(template, dest)
    } else {
      fs.copyFileSync(template, dest)
    }
  })
}

const copy = (templatePath: string, workingPath: string) => {
  try {
    const destFolderPath = path.join(workingPath, path.basename(templatePath))

    fs.mkdirSync(destFolderPath, { recursive: true })

    copyRecursion(templatePath, destFolderPath)

    console.log('successfully!')
  } catch (error) {
    console.error('Error :', error)
  }
}

const dirname = path.dirname(fileURLToPath(import.meta.url))
const templatePath = path.join(dirname, '../src/template/node-ts')
const workingPath = process.cwd()
copy(templatePath, workingPath)
