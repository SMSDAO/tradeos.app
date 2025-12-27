use anchor_lang::prelude::*;

#[program]
pub mod spl_vault_router {
    use super::*;

    pub fn reroute(ctx: Context<Reroute>, amount: u64) -> Result<()> {
        let vault = &ctx.accounts.reserve_wallet;
        let profit = (amount * 80) / 100;
        let user_share = amount - profit;

        **vault.to_account_info().try_borrow_mut_lamports()? += profit;
        **ctx.accounts.user.to_account_info().try_borrow_mut_lamports()? += user_share;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Reroute<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut, address = "J7bNrvf26uiWWg8sM43eQMwunaPgmvi7pdRC55CnebPE")]
    pub reserve_wallet: AccountInfo<'info>,
}
