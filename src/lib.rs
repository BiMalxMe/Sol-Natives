use borsh::{BorshDeserialize,BorshSerialize};

use solana_program::{account_info::{next_account_info,AccountInfo}, address_lookup_table::instruction, entrypoint::{self,ProgramResult}, msg, pubkey::Pubkey};

#[derive(BorshDeserialize,BorshSerialize)]
enum InstructionType{
    Increment(u32),
    Decrement(u32)
}

#[derive(BorshDeserialize,BorshSerialize)]
struct Counter{
    count : u32
}

entrypoint!(counter_contract);
pub fn counter_contract(
    program_id : &Pubkey,
    accounts : &[AccountInfo],
    instruction_data : &[u8]
) -> ProgramResult{
    let acc = next_account_info(&mut accounts.iter())?;
    let instruction_type = InstructionType::try_from_slice(instruction_data)?;
    let mut counter_data = Counter::try_from_slice(&acc.data.borrow())?;
    match instruction_type{
        InstructionType::Increment(val) => {
            msg!("Incrementing");
            counter_data.count += val;
        },
       InstructionType::Decrement(val) => {
        msg!("Decrementing");
        counter_data.count -= val;
       }
    };
    counter_data.serialize(&mut *acc.data.borrow_mut());
    msg!("contract Successfull updated to {}",counter_data.count);
    Ok(())
}
