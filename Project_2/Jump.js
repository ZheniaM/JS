function encode(str){
    let res = "";
    let symbols = "";
    let isRepeat = str[0] === str[1];
    for (let i = 1; i < str.length; i++){
        if (symbols.length === 127 + isRepeat){
            res += String.fromCharCode(127 + isRepeat * 128);
            res += isRepeat ? symbols[0] : symbols;
            symbols = "";
        }
        if (str[i-1] !== str[i]){
            if (isRepeat){
                isRepeat = false;
                res += String.fromCharCode(symbols.length + 128) + symbols[0];
                symbols = "";
                continue;
            }
            symbols += str[i-1];
            continue;
        }
        if (!isRepeat){
            res += String.fromCharCode(symbols.length) + symbols;
            symbols = ""; 
            isRepeat = true;
        }
        symbols += str[i-1];
    }
    if (symbols.length === 127 + isRepeat){
            res += String.fromCharCode(127 + isRepeat * 128);
            res += isRepeat ? symbols[0] : symbols;
            symbols = "";
    }
    symbols += str[str.length-1];
    res += String.fromCharCode(symbols.length + isRepeat * 127);
    res += isRepeat ? symbols[0] : symbols;
    return res;
}
function decode(str){
    let res = "";
    let repeat = 0;
    let isOneSym;
    for (SYM of str){
        if (!repeat){
            repeat = SYM.charCodeAt(0);
            isOneSym = repeat > 127;
            continue;
        }
        if (isOneSym){
            res += SYM.repeat(repeat - 127);
            repeat = 0;
            continue;
        }
        res += SYM;
        repeat--;
    }
    return res;
}
function read_file(FILENAME){
    const FS = require('fs');
    try {
        const DATA = FS.readFileSync(FILENAME, 'utf8');
        return DATA;
    } catch (err){
        console.log(err);
        process.exit(1);
    }
}
function push_data(FILENAME, CONTENT){
    const FS = require('fs');
    try{
        FS.writeFileSync(FILENAME, CONTENT)
    } catch (err){
        console.log(err);
        process.exit(1);
    }
}
(function main(){
    const INFILE = process.argv[3];
    const OUTFILE = process.argv[4];
    const FLAG = process.argv[2];
    switch (FLAG){
        case "-h" || "--help":
            console.log('USAGE: node Jump.js [-h/-e/-d] in.txt out.txt');
            break;
        case "-e" || "--encode":
            push_data(OUTFILE, encode(encode(read_file(INFILE))));
            break;
        case "-d" || "--decode":
            push_data(OUTFILE, decode(decode(read_file(INFILE))));
            break;
        default:
            console.log('[-] Invalig argument');
            console.log("type '-h' or '--help' for help");
            process.exit(1);
    }
})();