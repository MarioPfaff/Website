import { mkdirSync, existsSync, lstatSync, cpSync, rmSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { throwContentError, isWithinDirectory } from './ContentValidation.mjs'

export class AssetPublisher {
  constructor(rootDirectoryPath, imageMap) {
    this.rootDirectoryPath = rootDirectoryPath
    this.imageMap = imageMap
  }

  publish() {
    const stagingDirectoryPath = resolve('.generated/public')
    if (
      !isWithinDirectory(stagingDirectoryPath, this.rootDirectoryPath) ||
      (existsSync(resolve('.generated')) && lstatSync(resolve('.generated')).isSymbolicLink()) ||
      (existsSync(stagingDirectoryPath) && lstatSync(stagingDirectoryPath).isSymbolicLink())
    )
      throwContentError(stagingDirectoryPath, 'unsafe generated directory')
    rmSync(stagingDirectoryPath, { recursive: true, force: true })
    mkdirSync(stagingDirectoryPath, { recursive: true })
    if (existsSync('public')) cpSync('public', stagingDirectoryPath, { recursive: true })
    for (const [sourceFilePath, publicUrl] of this.imageMap) {
      const targetPath = join(stagingDirectoryPath, decodeURIComponent(publicUrl.slice(1)))
      mkdirSync(dirname(targetPath), { recursive: true })
      cpSync(sourceFilePath, targetPath)
    }
  }
}
