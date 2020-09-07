const constructorTest = () => {
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

    const basic = {
        user: "user",
        pass: "pass"
    };
    const kintone = new KintoneManager("xxxx", apps, "user", "pass", basic);

    console.log("subdomain: ", kintone.subdomain);
    console.log("apps: ", kintone.apps);
    console.log("authorization: ", kintone.authorization);
    console.log("basic: ", kintone.basic);
};
