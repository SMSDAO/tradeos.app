// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FeeRouter {
    address public owner;
    uint256 public feePct;

    constructor(uint256 _feePct) {
        owner = msg.sender;
        feePct = _feePct;
    }

    function route(address token, uint256 amount) external {
        uint256 fee = (amount * feePct) / 1000;
        // implement routing logic
    }

    function updateFee(uint256 pct) external {
        require(msg.sender == owner, "Not owner");
        feePct = pct;
    }
}
