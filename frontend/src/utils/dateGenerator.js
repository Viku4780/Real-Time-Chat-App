export function dateGenerator(){
    return new Date().toISOString()
}

export function dateInNumber(date){
    return Date.parse(date);
}