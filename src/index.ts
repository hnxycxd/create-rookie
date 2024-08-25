import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import prompts from 'prompts'
import minimist from 'minimist'

const argv = minimist(process.argv.slice(2), { alias: { t: 'template' }, string: ['_'] })
let projectName = ''
let templateName = ''

const dirname = path.dirname(fileURLToPath(import.meta.url))

const TEMPLATES = ['node-tsx', 'nodemon-ts-node']

const defaultTargetDir = 'rookie-project'

const formatTargetDir = (targetDir: string | undefined) => targetDir?.trim().replace(/\/+$/g, '')

const getPrompt = async () => {
  const argvTargetDir = formatTargetDir(argv._[0])
  const argvTemplate = argv.t || argv.template

  projectName = argvTargetDir || defaultTargetDir

  const response = await prompts([
    {
      type: argvTargetDir ? null : 'text',
      name: 'name',
      message: 'project name?',
      initial: argvTargetDir,
      onState: (state) => {
        projectName = formatTargetDir(state.value) || defaultTargetDir
      },
    },
    {
      type: argvTemplate && TEMPLATES.includes(argvTemplate) ? null : 'select',
      name: 'template',
      message:
        typeof argvTemplate === 'string' && !TEMPLATES.includes(argvTemplate)
          ? `"${argvTemplate}" isn't a valid template. Please choose from below: `
          : 'Select a template',
      choices: TEMPLATES.map((t) => ({ title: t, value: t })),
    },
  ])

  templateName = response.template || argvTemplate
}

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

const copy = (templatePath: string, destFolderPath: string) => {
  try {
    fs.mkdirSync(destFolderPath, { recursive: true })

    copyRecursion(templatePath, destFolderPath)

    console.log('successfully!')
  } catch (error) {
    console.error('Error :', error)
  }
}

const run = async () => {
  await getPrompt()

  const templatePath = path.join(dirname, `../src/template/${templateName}`)

  const destFolderPath = path.join(process.cwd(), projectName)

  copy(templatePath, destFolderPath)
}

run()
