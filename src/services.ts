import * as express from 'express'; 
import * as vscode from 'vscode';
import * as open from 'open';
import findAvailablePort from './findAvailablePort';
import share from './share';

export default  async () => {
    let port = await findAvailablePort(7777, 3);
    if(!port){
        // TODO
        port = 7777;
    }

    const app = express();

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