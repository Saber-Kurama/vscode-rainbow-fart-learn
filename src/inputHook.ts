import * as vscode from 'vscode';
import share from './share';

let inputHistory = '';
// 关键字
const keywordsCheck = () => {
    const canidate: any[] = [];
    // 
    share.maindata.forEach(voicePackage => {
        // 没有启用的 语音（中英文）
        if(!voicePackage.enabled){
            return;
        }
        voicePackage.contributes.forEach((contribute: any) => {
            let triggered = false;
            const keywords = [].concat(contribute.keywords || []); 
            // inputHistory 有 这个的关键字
            keywords.forEach( keyword => {
                if(inputHistory.indexOf(keyword) !== -1){
                    triggered = true;
                }
            });
            // 支持正则
            const regexps = [].concat(contribute.regexps || []);
            regexps.forEach( regexp => {
                if(RegExp(regexp).test(inputHistory)){
                    triggered = true;
                }
            });
            if(triggered){
                const voices = [].concat(contribute.voices);
                // 加载随机的一个声音来源
                canidate.push(`${voicePackage.name}/${voices[Math.floor(voices.length * Math.random())]}`)
            }
        })
    });

    if(canidate.length){
        inputHistory = '';
        // 播放 随机的 声音
        share.play(canidate[Math.floor( canidate.length * Math.random())])
    }
}

export default () => {
    vscode.workspace.onDidChangeTextDocument( evt => {
        console.log('evt----', evt)
        evt.contentChanges.forEach(change => {
            if(change.text.length > 30){
                // Some user may enabled the `format on save`, that will also cause `onDidChangeTextDocument` event.
                // So, If contents are too large, it's may not a keyword.
                return;
            }
            inputHistory += change.text;
            // 去掉空格的长度 大于 100 就修改inputHistory  只保留 100个长度
            if(inputHistory.replace(/\s/g, '').length > 100){
                // 这个多余的空格怎么处理呢？
                inputHistory = inputHistory.slice(inputHistory.length - 100 - 1)
            }
            try{
                keywordsCheck()
            }catch(e){
                console.error(e);
            }
        })
    })
}