
const TonWeb = require('../src');
const utils = TonWeb.utils;


(async () => {

    const addressStr = (
        '-1:3674ec71a2854a6bc36335c39eb9cc9c0a69d23cdc52c870181b4ae703bcca83'
    );

    const address = new utils.Address(addressStr);

    console.log('1:', address.wc === -1 ? 'OK' : 'FAIL');
    console.log('2:', address.isUserFriendly === false ? 'OK' : 'FAIL');
    console.log('3:', address.isUrlSafe === false ? 'OK' : 'FAIL');
    console.log('4:', address.isBounceable === false ? 'OK' : 'FAIL');
    console.log('5:', address.isTestOnly === false ? 'OK' : 'FAIL');
    console.log('6:', address.toString(false) === addressStr ? 'OK' : 'FAIL');

})();
