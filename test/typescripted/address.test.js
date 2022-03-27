
const TonWeb = require('../../src');
const utils = TonWeb.utils;

const testAddress = '0QAs9VlT6S776tq3unJcP5Ogsj-ELLunLXuOb1EKcOQi4-QO';


(async () => {

    const address = new utils.Address(testAddress);

    console.log(JSON.stringify({
        NF: address.toString(false),
        F_NS_NB_NT: address.toString(true, false, false, false),
        F_S_NB_NT: address.toString(true, true, false, false),
        F_NS_NB_T: address.toString(true, false, false, true),
        F_S_NB_T: address.toString(true, true, false, true),
        F_NS_B_NT: address.toString(true, false, true, false),
        F_S_B_NT: address.toString(true, true, true, false),
        F_NS_B_T: address.toString(true, false, true, true),
        F_S_B_T: address.toString(true, true, true, true),

    }, null, 4));

    const address2 = new utils.Address(
        '-1:3674ec71a2854a6bc36335c39eb9cc9c0a69d23cdc52c870181b4ae703bcca83'
    );

    console.log(address2.wc === -1 ? 'OK' : 'FAIL');
    console.log(address2.isUserFriendly === false ? 'OK' : 'FAIL');
    console.log(address2.isUrlSafe === false ? 'OK' : 'FAIL');
    console.log(address2.isBounceable === false ? 'OK' : 'FAIL');
    console.log(address2.isTestOnly === false ? 'OK' : 'FAIL');

    console.log(address2.toString(false));

})();
