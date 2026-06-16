import { ethers } from "hardhat";

async function main() {

    const [acbAdmin] = await ethers.getSigners();


    console.log("Deploying TraceTax with ACB Admin:", acbAdmin.address);
    console.log("Account balance:", (await ethers.provider.getBalance(acbAdmin.address)).toString());


    const traceTax = await ethers.deployContract("TraceTax");


    await traceTax.waitForDeployment();

    const contractAddress = await traceTax.getAddress();

    console.log("✅ TraceTax successfully deployed!");
    console.log("📍 Contract Address:", contractAddress);


    console.log("Self-verifying ACB Admin DID...");
    const tx = await traceTax.verifyIdentity(acbAdmin.address);
    await tx.wait();
    console.log("💎 ACB Admin DID is now VERIFIED.");
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});