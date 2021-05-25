import * as vscode from 'vscode';
import * as glob from 'glob';
import * as path from 'path';
import share from './share';
import settings from './settings';

const fs = vscode.workspace.fs;
const builtInVoucePackages = [];
const init = async() => {
    console.log(share.PATH_VOICE_PACKAGES);
    // 创建 目录
    await fs.createDirectory(share.uri(share.PATH_VOICE_PACKAGES));
    const sourceFiles = glob.sync('*', { cwd: `${__dirname}/built-in-voice-packages`});
    const targetFiles = glob.sync('*', { cwd: share.PATH_VOICE_PACKAGES});

    console.log('sourceFiles', sourceFiles)
    console.log('targetFiles', targetFiles)
    for(let i in sourceFiles){
        const sourceName = sourceFiles[i];
        builtInVoucePackages.push(sourceName);
        const sourceFolderUri = share.uri(path.resolve(__dirname, 'built-in-voice-packages', sourceName));
        const targetFolderUri = share.uri(path.resolve(share.PATH_VOICE_PACKAGES, sourceName));
        
        if(targetFiles.indexOf(sourceName) === -1){
            await fs.copy(sourceFolderUri, targetFolderUri)
        }else{
            // 判断 资源版本 是否相等
            let sourceManifest, targetManifest;
            const sourceManifestUri = share.uri(path.resolve(share.uriToPath(sourceFolderUri), 'manifest.json'));
            const targetManifestUri = share.uri(path.resolve(share.uriToPath(targetFolderUri), 'manifest.json'));
            try {
                sourceManifest = JSON.parse((await fs.readFile(sourceManifestUri)).toString());
                targetManifest = JSON.parse((await fs.readFile(targetManifestUri)).toString());
            } catch (e) {
                console.error(e);
            }
            if (sourceManifest.version != targetManifest.version) {
                await fs.copy(sourceFolderUri, targetFolderUri, { overwrite: true });
            }
        }
    }

}

const load = async () =>  {
    const voicePackages = glob.sync("*", {
        cwd: share.PATH_VOICE_PACKAGES,
        absolute: true
    });

    const maindata = [];

    for (let voicePackagePath of voicePackages) {
        const files = glob.sync("*.json", { cwd: voicePackagePath, absolute: true });
        let config: any = {};
        for (let filepath of files) {
            try {
                let filecontent = await fs.readFile(share.uri(filepath));
                config = Object.assign(config, JSON.parse(filecontent.toString()));
            } catch (e) {
                console.error(e);
            }
        }
        config.enabled = settings.voices.isEnabled(config.name);
        maindata.push(config);
    }

    share.maindata = maindata;
}

export default {
    init,
    load,
}