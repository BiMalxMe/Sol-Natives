import * as borsh from "borsh"

export class CounterAccount {
    count : number

    constructor({count}:{count : number}){
        this.count = count
    }
}

export const schema : borsh.Schema  = {
    struct : {
        count : 'u32'
    }
}
export const ContractSize = borsh.serialize(schema,new CounterAccount({count : 0})).length;
// console.log(borsh.serialize(schema,new CounterAccount({count : 512})))