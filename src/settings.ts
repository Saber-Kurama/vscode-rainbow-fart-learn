import * as vscode from 'vscode';
import share  from './share';

let settings: {
    enabledVoicePackages: string[]
} = {
    enabledVoicePackages: [],
}
const voices = {
    isEnabled(item: string) {
        return (settings.enabledVoicePackages.indexOf(item) !== -1)
    }
}
function save() {
    var uri = share.uri(share.PATH_SETTINGS);
    var data = Buffer.from(JSON.stringify(settings));
    console.log(vscode.workspace);
    vscode.workspace.fs.writeFile(uri, data);
}
const load = async () => {
  try {
      const uri = share.uri(share.PATH_SETTINGS);
      settings = JSON.parse((await vscode.workspace.fs.readFile(uri)).toString())
  } catch (e) {
     // TODO: Ignore this error only if settings.json is not exists.
     let locale = JSON.parse(process.env.VSCODE_NLS_CONFIG || `{locale: 'zh' }`).locale;
     if (locale.indexOf("zh") == 0) {
         settings.enabledVoicePackages = ['built-in-voice-chinese'];
     } else {
         settings.enabledVoicePackages = ["built-in-voice-english"];
     }
     save();
  }
};

export default {
  load,
  save,
  voices
};
