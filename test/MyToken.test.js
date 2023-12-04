const { expect } = require("chai")
// const { networkConfig } = require("../helper-hardhat-config")
const { ethers, network } = require("hardhat")
const {
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers")

const CONTRACT_NAME = "MyToken"
const TEST_AMOUNT_OF_TOKENS = 10

describe(`${CONTRACT_NAME} contract`, function () {
    async function deployTokenFixture() {
        // Get the Signers here.
        const [owner, addr1, addr2] = await ethers.getSigners()

        // To deploy our contract, we just have to call ethers.deployContract and await
        // its waitForDeployment() method, which happens once its transaction has been
        // mined.
        await deployments.fixture(["all"])
        contract = await ethers.getContract(CONTRACT_NAME, owner)

        await contract.waitForDeployment()

        // Fixtures can return anything you consider useful for your tests
        return { contract, owner, addr1, addr2 }
    }
    describe("Deployment", function () {
        // `it` is another Mocha function. This is the one you use to define each
        // of your tests. It receives the test name, and a callback function.
        //
        // If the callback function is async, Mocha will `await` it.

        it("Should assign the total supply of tokens to the owner", async function () {
            const { contract, owner } = await loadFixture(deployTokenFixture)
            const ownerBalance = await contract.balanceOf(owner.address)
            expect(await contract.totalSupply()).to.equal(ownerBalance)
        })
    })

    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
            const { contract, owner, addr1, addr2 } =
                await loadFixture(deployTokenFixture)
            // Transfer TEST_AMOUNT_OF_TOKENS tokens from owner to addr1
            await expect(
                contract.transfer(addr1.address, TEST_AMOUNT_OF_TOKENS),
            ).to.changeTokenBalances(
                contract,
                [owner, addr1],
                [-TEST_AMOUNT_OF_TOKENS, TEST_AMOUNT_OF_TOKENS],
            )

            // Transfer TEST_AMOUNT_OF_TOKENS tokens from addr1 to addr2
            // We use .connect(signer) to send a transaction from another account
            await expect(
                contract
                    .connect(addr1)
                    .transfer(addr2.address, TEST_AMOUNT_OF_TOKENS),
            ).to.changeTokenBalances(
                contract,
                [addr1, addr2],
                [-TEST_AMOUNT_OF_TOKENS, TEST_AMOUNT_OF_TOKENS],
            )
        })

        it("Should emit Transfer events", async function () {
            const { contract, owner, addr1, addr2 } =
                await loadFixture(deployTokenFixture)

            // Transfer TEST_AMOUNT_OF_TOKENS tokens from owner to addr1
            await expect(
                contract.transfer(addr1.address, TEST_AMOUNT_OF_TOKENS),
            )
                .to.emit(contract, "Transfer")
                .withArgs(owner.address, addr1.address, TEST_AMOUNT_OF_TOKENS)

            // Transfer TEST_AMOUNT_OF_TOKENS tokens from addr1 to addr2
            // We use .connect(signer) to send a transaction from another account
            await expect(
                contract
                    .connect(addr1)
                    .transfer(addr2.address, TEST_AMOUNT_OF_TOKENS),
            )
                .to.emit(contract, "Transfer")
                .withArgs(addr1.address, addr2.address, TEST_AMOUNT_OF_TOKENS)
        })

        it("Should fail if sender doesn't have enough tokens", async function () {
            const { contract, owner, addr1 } =
                await loadFixture(deployTokenFixture)
            const initialOwnerBalance = await contract.balanceOf(owner.address)

            // Try to send 1 token from addr1 (0 tokens) to owner.
            // `require` will evaluate false and revert the transaction.
            await expect(
                contract.connect(addr1).transfer(owner.address, 1),
            ).to.be.revertedWithCustomError(
                contract,
                "ERC20InsufficientBalance",
            )

            // Owner balance shouldn't have changed.
            expect(await contract.balanceOf(owner.address)).to.equal(
                initialOwnerBalance,
            )
        })
    })
})
