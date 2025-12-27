// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TradeOSBadges is ERC721 {
    uint256 public nextId;

    constructor() ERC721("TradeOS Badge", "TOB") {}

    function mint(address to) external returns (uint256) {
        uint256 id = nextId++;
        _safeMint(to, id);
        return id;
    }
}
