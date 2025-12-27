pub fn apply_fee_mask(tx_type: &str) -> u64 {
    match tx_type {
        "launchpad" | "bot_dashboard" => 10000, // 0.00001 SOL in lamports
        _ => 0,
    }
}
