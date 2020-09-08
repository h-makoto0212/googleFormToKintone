import { KintoneManager } from "/src/kintoneManager.js";

const getFormResponse = ({ response }) => {
    const itemResponses = response.getItemResponses(); //アンケートの回答を取得
    let records = "[{";
    //回答者のEmailアドレスの取得
    //メールアドレスの収集設定が有効でなければコメントアウト
    /*
        const mailAddress = e.response.getRespondentEmail();
        const mailFieldCode = "Email";
        records += `"${mailFieldCode}": { "value": "${mailAddress}" },`;
    */

    //Mapオブジェクトの定義
    //[フォームアイテムのタイトル,対応するkintoneのフィールドコード]...
    /* flags:
        チェックボックス・複数選択の場合はフィールドコードの末尾に「/m」を付ける
        作成日時・日時の場合はフィールドコードの末尾に「/d」を付ける
        ユーザー選択・組織選択・グループ選択の場合はフィールドコードの末尾に「/um」を付ける
        作成者・更新者の場合はフィールドコードの末尾に「/u」を付ける
        添付ファイルの場合はフィールドコードの末尾に「/f」を付ける
    */
    let cMap = new Map([
        ["名前", ["name1", "name2"]],
        ["年齢", ["age1", "age2"]],
        ["出身地", ["from1", "from2"]],
        ["代表者名", "leader/um"],
        ["好きな果物(複数可)", "fav-fruits/m"],
        ["予約日時", "reservation-date-and-time/d"],
        ["添付ファイル", "file/f"]
    ]);

    //配列型のJSON形式対応
    //in: hoge,fuga,piyo
    //out: "hoge"."fuga","piyo"
    const convertToArrayType = (postValues) => {
        postValues = postValues.map((x) => `"${x}"`);
        return postValues.join(",");
    };

    //日時の形式対応
    //in: yyyy/MM/DD HH:mm:ss
    //out: yyyy-MM-dd T HH:mm:ss +09:00
    const convertToDateAndTimeValue = (postValue) => {
        const timeZone = "Asia/Tokyo";
        const ISOformat = "yyyy-MM-dd'T'HH:mm:ss'+09:00'";
        return Utilities.formatDate(new Date(postValue), timeZone, ISOformat);
    };

    //ユーザー系の形式対応
    const convertToUserType = (postValue) => {
        if (postValue.constructor === Array) {
            postValue = postValue.map((x) => `{ "code" : "${x}" }`);
            return postValue.join(",");
        } else {
            return `{ "code" : "${postValue}"}`;
        }
    };

    //添付ファイルの形式対応
    const convertToFileType = (postValue) => {
        if (postValue.constructor === Array) {
            postValue = postValue.map((x) => `{ "fileKey" : "${x}" }`);
            return postValue.join(",");
        } else {
            return `{ "fileKey" : "${postValue}"}`;
        }
    };

    const convertToJsonText = (postCode, postValue) => {
        let isArrayType = false;
        if (/\/(.*?)d/.test(postCode)) {
            postValue = convertToDateAndTimeValue(postValue);
        } else if (/\/(.*?)u/.test(postCode)) {
            postValue = convertToUserType(postValue);
            if (/\/(.*?)m/.test(postCode)) {
                isArrayType = true;
            }
        } else if (/\/(.*?)f/.test(postCode)) {
            isArrayType = true;
            postValue = convertToFileType(postValue);
        } else if (/\/(.*?)m/.test(postCode)) {
            isArrayType = true;
            postValue = convertToArrayType(postValue);
        } else {
            postValue = `"${postValue}"`;
        }
        postCode = postCode.replace(/\/(.*)/, ""); //フラグを削除する
        return isArrayType
            ? `"${postCode}": { "value" : [${postValue}] },`
            : `"${postCode}": { "value" : ${postValue} },`;
    };

    itemResponses.forEach((itemResponse) => {
        const title = itemResponse.getItem().getTitle();
        if (cMap.has(title)) {
            const postValue = itemResponse.getResponse();
            const postCode = cMap.get(title);
            if (postCode.constructor === Array) {
                const postCodeChild = postCode[0];
                records += convertToJsonText(postCodeChild, postValue);
                if (postCode.length > 1) {
                    cMap.set(title, postCode.slice(1));
                }
            } else {
                records += convertToJsonText(postCode, postValue);
            }
        }
    });
    records = records.slice(0, -1); //末尾のカンマを削除する
    records += "}]";
    console.log("Response JSON is '%s'", records);
    return records;
};

const sendToKintone = (e) => {
    //認証情報を入力する
    const subdomain = "サブドメイン"; //https://{subdomain}.cybozu.com
    const apps = {
        app1: {
            appid: "アプリID",
            name: "アプリ名",
            token: "APIトークン" //パスワード認証の場合は省略可能
        }
    };

    //パスワード認証を行う場合はAPIトークンの代わりに以下を追加入力する
    /*
        const user = ユーザー名;
        const pass = パスワード;
    */

    //ライブラリ「MDT2NQ9jkAGYJ-7ftp_A0v08CaFRWuzzx」を利用する
    //src: https://github.com/Arahabica/KintoneManager/blob/master/KintoneManager.gs
    //doc: https://qiita.com/Arahabica/items/063877b0da439020d2c2
    const manager = new KintoneManager(subdomain, apps);
    //パスワード認証の場合は直前の行を下のように書き換える
    //const manager = new KintoneManager(subdomain, apps, user, pass);
    let str = getFormResponse(e); //POSTする通常回答を取得する

    //特殊文字のエスケープ処理
    str = str.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
    const records = JSON.parse(str); //JSON形式に変換
    const response = manager.create("app1", records); //kintone レコードの生成
    // レスポンス結果
    const code = response.getResponseCode();
    const body = response.getContentText();
    console.log("Response code is '%s'", code); // 成功すれば200になる
    console.log("Response body is '%s'", body); // エラーならここに詳細が出力される
};
