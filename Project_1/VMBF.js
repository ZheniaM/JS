function get_argv(){
    if (process.argv[2] !== '--mode'){
        return {
            name: process.argv[2],
            mode: 8,
            input: `${process.argv[3]},${process.argv[4]},`,
        };
    }
    switch (process.argv[3]){
        case '8':
        case '16':
        case '32':
            return {
                name: process.argv[4],
                mode: Number(process.argv[3]),
                input: `${process.argv[5]},${process.argv[6]},`,
            }
        default:
            console.log('[-] Invalid argument');
            console.log('[-] Argument of --mode could be 8 or 16 or 32');
            console.log('Default argument is 8')
            process.exit(1);
    }
}
function get_data_from_file(FILENAME){
    const FS = require('fs');
    try {
        const DATA = FS.readFileSync(FILENAME, 'utf8');
        return DATA;
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}
function add_data_to_memory(memory, DATA, END){
    let j = 0;
    for (let i = 0; i < DATA.length; i++){
        switch (DATA[i]){
            case "+":
            case "-":
            case ">":
            case "<":
            case ".":
            case ",":
                memory[j++] = DATA[i];
                break;
            case "[":
                memory[j++] = DATA[i];
                memory[END]++;
                break;
            case "]":
                if (memory[END] === 0){
                    console.log("[-] There is an unopened bracket");
                    console.exit(1);
                }
                memory[END]--;
                memory[j++] = DATA[i];
            default:
                break;
        }
    }
    if (memory[END]){
        console.log('[-] Not enough brackets');
        process.exit(1);
    }
    memory[END] = 0;
}
function do_bfcode(memory, START, END, MAXVALUE, input){
    let cip = 0;
    let mip = START;
    let output = "";
    let sip = END;
    while (cip < START){
        switch (memory[cip]){
            case '+':
                cip++;
                if (memory[mip] === MAXVALUE - 1){
                    memory[mip] = 0;
                    break;
                }
                memory[mip]++;
                break;
            case '-':
                cip++;
                if (memory[mip] === 0){
                    memory[mip] = MAXVALUE - 1;
                    break;
                }
                memory[mip]--;
                break;
            case '>':
                cip++;
                if (mip === END - 1){
                    mip = START;
                    break;
                }
                mip++;
                break;
            case '<':
                cip++
                if (mip === START){
                    mip = END - 1;
                    break;
                }
                mip--;
                break;
            case '.':
                cip++;
                output += String.fromCharCode(memory[mip]);
                break;
            case ',':
                cip++;
                if (input.length === 0){
                    console.log("[-] Not enough data in input");
                    process.exit(1);
                }
                memory[mip] = input[0].charCodeAt();
                input = input.slice(1, input.length);
                break;
            case '[':
                cip++;
                if (!memory[mip]){
                    memory[sip]++;
                    while (memory[sip] !== 0){
                        if (memory[cip] === '['){
                            memory[sip]++;
                        } else if (memory[cip] === ']'){
                            memory[sip]--;
                        }
                        cip++;
                    }
                    break;
                }
                memory[sip++] = cip - 1;
                break;
            case ']':
                cip = memory[--sip];
                memory[sip] = 0;
                break;
        }
    }
    console.log(output);
}

(function main(){
    const MEMSIZE = 30_000;
    const ARGUEMENTS = get_argv();
    const FILENAME = ARGUEMENTS.name;
    if (FILENAME.split('.').pop() !== 'bf' && FILENAME.split('.').pop() !== 'b'){
        console.log('[-] This is not a brainfuck file');
        console.log('    File extension could be .bf or .b');
        process.exit(1);
    }
    const DATAFILE = get_data_from_file(FILENAME);
    const MINIP = DATAFILE.match(/[+<>,.[\]\-]/g).length;
    const MAXIP = MINIP + MEMSIZE;
    let memory = new Array(MAXIP + MINIP).fill(0);
    add_data_to_memory(memory, DATAFILE, MINIP);
    do_bfcode(memory, MINIP, MAXIP, 2 ** ARGUEMENTS.mode, ARGUEMENTS.input);
})();