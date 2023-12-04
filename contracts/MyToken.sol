// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract MyToken is ERC20 {
    constructor(uint _initialSupply) ERC20("MyToken", "MTK") {
        _mint(msg.sender, _initialSupply);
    }
}
