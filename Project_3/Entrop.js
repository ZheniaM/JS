function alphabet(str){
    let res = {};
    for(let i = 0; i < str.length; i++){
        if(str[i] in res)
            res[str[i]]++;
        else 
            res[str[i]] = 1;
    }
    return res;
}
function entrop(str){
    let res = 0;
    let a = alphabet(str);
    let p;
    for (i in a){
        p = a[i]/str.length;
        console.log(`${i} ---> ${p}`);
        res -= p * Math.log2(p);
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
(function main(){
    const INFILE = process.argv[2];
    const DATA = read_file(INFILE);
    console.log(DATA.length === 1 ? 1 : entrop(DATA));

})();