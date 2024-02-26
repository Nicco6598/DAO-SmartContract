import { ethers } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  // Carica il contratto
  const MyContract = await ethers.getContractFactory('Dao');

  // Sostituisci "_tokenAddress" con l'indirizzo effettivo del token ERC20
  const tokenAddress = "0x6F0615C3dDD5362Da3f3A0d46562A406ab9fbf00"; // Sostituisci con l'indirizzo del tuo token ERC20
  const tokenPrice = 100; // Sostituisci con il prezzo effettivo
  
  const myContract = await MyContract.deploy(tokenAddress, tokenPrice);

  console.log('Contract deployed to address:', myContract.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });