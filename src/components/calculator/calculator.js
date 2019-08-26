export default {
    formatMoney(num, places, symbol, thousand, decimal) {
        places = !isNaN(places = Math.abs(places)) ? places : 2;
        symbol = symbol !== undefined ? symbol : "$";
        thousand = thousand || ",";
        decimal = decimal || ".";
        var number = num,
            negative = number < 0 ? "-" : "",
            i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
            j = (j = i.length) > 3 ? j % 3 : 0;
        return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
    },
    preventNotNumber(event) {
        var keyValue = event["key"],
            keyUnicode = event["keyIdentifier"];

        function isBackspace() {
            if (keyValue) {
                return keyValue === "Backspace";
            } else if (keyUnicode) {
                return keyUnicode === "U+0008";
            }
        }

        function isDot() {
            if (keyValue) {
                return keyValue === ".";
            } else if (keyUnicode) {
                return keyUnicode === "U+002E";
            }
        }

        function isNumber() {
            if (keyValue) {
                return keyValue >= 0 && keyValue <= 9;
            } else if (keyUnicode) {
                var unicode = Number(
                    keyUnicode.slice(keyUnicode.length - 4, keyUnicode.length)
                );
                return unicode >= 30 && unicode <= 39;
            }
        }
        if (!(isBackspace() || isDot() || isNumber())) {
            // 其他按键
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    },
    iphoneXLayout() {
        // 兼容iphoneX布局
        if (window.screen.height >= 812) {
            return true;
        } else {
            return false;
        }
    }
};