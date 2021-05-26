import * as vscode from "vscode";
import * as os from "os";
import * as path from "path";

const WINDOWS_NT = "Windows_NT";

export default {
  PATH_GLOBAL: "",
  PATH_TMP: "",
  PATH_SETTINGS: "", // setting.json的地址
  PATH_VOICE_PACKAGES: "",
  maindata: [] as any[],
  playVoiceRes: null as any,

  setPath(globalPath: string) {
    this.PATH_GLOBAL = globalPath;
    this.PATH_TMP = path.resolve(globalPath, "temp");
    this.PATH_SETTINGS = path.resolve(globalPath, "settings.json");
    this.PATH_VOICE_PACKAGES = path.resolve(globalPath, "voice-packages");
  },

  play(name: string) {
    if (!name || !this.playVoiceRes) {
      return;
    }
    console.log("Playing voice - " + name);
    this.playVoiceRes && this.playVoiceRes.send(name);
    this.playVoiceRes = null;
  },

  uri(thepath: string): vscode.Uri {
    if (os.type() === WINDOWS_NT) {
      thepath = `file:///${thepath.replace(/\\/g, "/")}`;
    } else {
      thepath = `file://${thepath}`;
    }
    console.log(vscode.Uri.parse(thepath));
    return vscode.Uri.parse(thepath);
  },

  uriToPath(uri: vscode.Uri): string {
    if (os.type() === WINDOWS_NT) {
      // TODO 这个是否正确
      return uri.path.replace(/^\//, "").replace(/\//g, "\\");
    }
    return uri.path;
  },
};
