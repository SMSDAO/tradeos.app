// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TradeOSAccess is Ownable {
    mapping(address => bool) public admins;

    function addAdmin(address user) external onlyOwner {
        admins