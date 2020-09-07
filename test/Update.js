const updateTest = () => {
    const apps = {
        // アプリケーション名はkintoneのデータに依存せず、GAS内のコードで取り扱う専用
        YOUR_APP_NAME1: {
            appid: 1,
            guestid: 2,
            name: "日報",
            token: "XXXXXXXXXXXXXX_YOUR_TOKEN_XXXXXXXXXXXXXX" // 省略可。APIトークン認証時に使用
        },
        YOUR_APP_NAME2: {}
    };

    const kintone = new KintoneManager("xxxx", apps);
    const records = [
        {
            id: 7,
            record: {
                name: {
                    value: "テストA"
                }
            }
        },
        {
            id: 8,
            record: {
                name: {
                    value: "テストB"
                }
            }
        }
    ];

    const response = kintone.update("YOUR_APP_NAME1", records);
    const code = response.getResponseCode();
    const body = response.getContentText();
    console.log("Response code is", code); // 成功すれば200になる
    console.log("Response body is", body); // エラーならここに詳細が出力される
};