// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract ManualToken {
    mapping(address => uint) public s_balanceOf;
    mapping(address => mapping(address => uint)) public s_allowance;

    function transfer(address _from, address _to, uint _amount) public {
        s_balanceOf[_from] = balanceOf[_from] - _amount;
        s_balanceOf[_to] += _amount;
    }

    function transferFrom() returns () {}
}
