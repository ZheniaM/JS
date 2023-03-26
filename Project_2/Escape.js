function encode(str, ESC="#"){
    let res = "";
    (function countSymbols(str){
        let res = new Array();
        let count = 1;
        let prev = str[0];
        for (const SYM of str.slice(1, str.length)){
            if (SYM === prev){
                count++;
                continue;
            }
            res.push({
                n: count,
                SYM: prev,
            });
            prev = SYM;
            count = 1;
        }
        res.push({
            n: count,
            SYM: prev,
        });
        return res;
    })(str).forEach(element => {
        let repeat = element.n;
        if (element.SYM === ESC){
            while (repeat > 255){
                res += ESC + String.fromCharCode(255) + ESC;
                repeat -= 255;
            }
            if (repeat)
                res += ESC + String.fromCharCode(repeat) + ESC;
            return;
        }
        while (repeat > 259){
            res += ESC + String.fromCharCode(255) + ESC;
            repeat -= 259;
        }
        if (repeat <= 3){
            res += element.SYM.repeat(repeat);
            return;
        }
        res += ESC + String.fromCharCode(repeat - 4) + element.SYM;
    });
    return res;
}
function decode(str, ESC="#"){
    let res = "";
    let repeat;
    let isSym = false;
    let isCode = false;
    for (const SYM of str){
        if (isCode){
            isSym = isCode--;
            repeat = SYM.charCodeAt(0);
            continue;
        }
        if (isSym){
            isSym = false;
            res += SYM.repeat(SYM === ESC ? repeat : repeat + 4);
            continue
        }
        if (SYM === ESC){
            isCode = true;
            continue;
        }
        res += SYM;
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
            console.log('USAGE: node Escapre.js [-h/-e/-d] in.txt out.txt');
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
/*
function show(str){
    for(const SYM of str){
        console.log(`${SYM} ---> ${SYM.charCodeAt(0)}`);
    }
    console.log();
}
let test = "#".repeat(500);
test = encode(test);
show(test);
test = decode(test);
console.log(test.length);
*/