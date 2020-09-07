const initializeTest = () => {
    const checkMembers = (kintone,symbole) => {
        console.log(symbole,"subdomain: ", kintone.subdomain);
        console.log(symbole,"apps: ", kintone.apps);
        console.log(symbole,"authorization: ", kintone.authorization);
        console.log(symbole,"basic: ", kintone.basic);
    };

    //空のクラスを作成する
    let kintone = new kintoneManager();
    checkMembers(kintone,1);

    const apps = {
        YOUR_APP_NAME1: {
            appid: 1,
            guestid: 2,
            name: "日報",
            token: "XXXXXXXXXXXXXX_YOUR_TOKEN_XXXXXXXXXXXXXX"
        },
        YOUR_APP_NAME2: {}
    };

    const basic = {
        user: "user",
        pass: "pass"
    };

    //再登録を行う
    kintone.initialize("xxxx", apps, "user", "pass", basic)
    checkMembers(kintone,2);
};