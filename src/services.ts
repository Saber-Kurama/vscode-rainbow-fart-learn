import * as express from 'express'; 
import * as vscode from 'vscode';
import * as open from 'open';
import * as path from 'path';
import findAvailablePort from './findAvailablePort';
import share from './share';
import assets from './assets';

export default  async () => {
    let port = await findAvailablePort(7777, 3);
    if(!port){
        // TODO
        port = 7777;
    }

    const app = express();
    
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(express.text());
    app.use(express.raw());
    // 界面
    app.use(express.static(path.resolve(__dirname, 'page/dist')));
    // 音频资源
    app.use('/voices', express.static(share.PATH_VOICE_PACKAGES));
    // 劫持 请求播放
    app.get("/playsound", (req, res) => {
        share.playVoiceRes = res;
    });
    // 获取 所有的音频资源
    app.get("/voice-packages", async (req, res) => {
        const { reload } = req.query;
        if (reload) {
            await assets.load();
        }
        res.json(share.maindata);
    })
    // 打开 vscode的资源
    app.get("/open-voice-packages-directory", async (req, res) => {
        open(share.PATH_VOICE_PACKAGES);
        res.send();
    })

    share.showTip = function() {
        vscode.window.showInformationMessage(`🌈 Rainbow Fart is running on http://127.0.0.1:${port}/`, "open").then(result => {
            if (result === "open") {
                open(`http://127.0.0.1:${port}/`);
            }
        })
    }
    app.listen(port, '127.0.0.1', () => {
        share.showTip();
    })
}