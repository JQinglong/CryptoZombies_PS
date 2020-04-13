var Adoption = artifacts.require("Adoption");
// var ERC721 = artifacts.require("ERC721");
// var KittyInterface = artifacts.require("KittyInterface");
var Ownable = artifacts.require("Ownable");
var SafeMath = artifacts.require("SafeMath");
var SafeMath16 = artifacts.require("SafeMath16");
var SafeMath32 = artifacts.require("SafeMath32");
var ZombieAttack = artifacts.require("ZombieAttack");
var ZombieFactory = artifacts.require("ZombieFactory");
var ZombieFeeding = artifacts.require("ZombieFeeding");
var ZombieHelper = artifacts.require("ZombieHelper");
var ZombieOwnership = artifacts.require("ZombieOwnership");

module.exports = function(deployer) {
    deployer.deploy(Adoption);
    // deployer.deploy(ERC721);
    // deployer.deploy(KittyInterface);
    deployer.deploy(Ownable);
    deployer.deploy(SafeMath);
    deployer.deploy(SafeMath16);
    deployer.deploy(SafeMath32);
    deployer.deploy(ZombieAttack);
    deployer.deploy(ZombieFactory);
    deployer.deploy(ZombieFeeding);
    deployer.deploy(ZombieHelper);
    deployer.deploy(ZombieOwnership);
};
