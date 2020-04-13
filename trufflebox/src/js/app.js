App = {
  web3Provider: null,
  contracts: {},
  zombieOwnershipInstance: null,
  zombieFactoryInstance: null,

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://10.200.10.1:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    var userAccount;

    $.getJSON('Adoption.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);
    
      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the adopted pets
      return App.markAdopted();
    });

    $.getJSON('ZombieFactory.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var ZombieFactorypArtifact = data;
      App.contracts.ZombieFactory = TruffleContract(ZombieFactorypArtifact);
    
      // Set the provider for our contract
      App.contracts.ZombieFactory.setProvider(App.web3Provider);

    });

    $.getJSON('ZombieOwnership.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var ZombieOwnershipArtifact = data;
      App.contracts.ZombieOwnership = TruffleContract(ZombieOwnershipArtifact);
    
      // Set the provider for our contract
      App.contracts.ZombieOwnership.setProvider(App.web3Provider);
      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }
      
        var account = accounts[0];
        console.log('[ac]' + account);
        // console.log('[App.getZombiesByOwner(account)]' + App.getZombiesByOwner(account));

        return App.getZombiesByOwner(account);
        // .then(displayZombies);

      });
    });
    // var accountInterval = setInterval(function() {
    //   web3.eth.getAccounts(function(error, accounts) {
    //     if (error) {
    //       console.log(error);
    //     }
      
    //     userAccount = accounts[0];
    //     App.getZombiesByOwner(userAccount)
    //     .then(displayZombies);

    //   });
    // }, 100);

    
    // App.contracts.Adoption.Transfer({ filter: { _to: userAccount } })
    // .on("data", function(event) {
    //   let data = event.returnValues;
    //   getZombiesByOwner(userAccount).then(displayZombies);
    // }).on("error", console.error);

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
    //仮
    $(document).on('click', '.btn-create', App.createRandomZombie);
  },

  markAdopted: function(adopters, account) {
    var adoptionInstance;

    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;
      // console.log('[adoptionInstance.getAdopters.call]' + adoptionInstance.getAdopters.call);

      return adoptionInstance.getAdopters.call();
    }).then(function(adopters) {
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  displayZombies: function(ids) {
    $("#zombies").empty();

    for (id of ids) {
      console.log('[id]' + id);
      // Look up zombie details from our contract. Returns a `zombie` object
      new Promise(function(resolve, reject) {
        // console.log(App.getZombieDetails(id));
        resolve(App.getZombieDetails(id));
      }).then(function(zombie) {
        // Using ES6's "template literals" to inject variables into the HTML.
        // Append each one to our #zombies div
        console.log('[z1]');
        console.log(zombie);
        $("#zombies").append(`<div class="zombie">
          <ul>
            <li>Name: ${/* zombie.name */zombie[0]}</li>
            <li>DNA: ${/* zombie.dna */zombie[1]}</li>
            <li>Level: ${/* zombie.level */zombie[2]}</li>
            <li>Wins: ${/* zombie.winCount*/zombie[4]}</li>
            <li>Losses: ${/* zombie.lossCount */zombie[5]}</li>
            <li>Ready Time: ${/* zombie.readyTime */zombie[3]}</li>
          </ul>
        </div>`);
      },function(){console.log('rej');})
      .catch(error => console.log(error));
    }
  },

  createRandomZombie: function(name) {
    // This is going to take a while, so update the UI to let the user know
    // the transaction has been sent
    $("#txStatus").text("Creating new zombie on the blockchain. This may take a while...");
    // Send the tx to our contract:

    //仮
    name = 'test3';
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var userAccount = accounts[0];

      // var zombieOwnershipInstance;
      App.zombieOwnershipInstance.createRandomZombie(name, { from: userAccount });
      // App.contracts.ZombieFactory.deployed().then(function(instance) {
      //   App.zombieFactoryInstance = instance;
        // console.log('[zombieOwnershipInstance.getZombiesByOwner]' + zombieOwnershipInstance.getZombiesByOwner);
        // return App.zombieFactoryInstance.createRandomZombie(name);
        // return App.zombieFactoryInstance.createRandomZombie(name, { from: userAccount });
        // return App.zombieFactoryInstance.createRandomZombie(name, { from: userAccount });
        // .on("receipt", function(receipt) {
        //   $("#txStatus").text("Successfully created " + name + "!");
        //   // Transaction was accepted into the blockchain, let's redraw the UI
        //   getZombiesByOwner(userAccount).then(displayZombies);
        // })
      // }).on("error", function(error) {
      //     // Do something to alert the user their transaction has failed
      //     $("#txStatus").text(error);
      // });
    });
  },

  feedOnKitty: function(zombieId, kittyId) {
    $("#txStatus").text("Eating a kitty. This may take a while...");
    return App.contracts.ZombieOwnership.feedOnKitty(zombieId, kittyId)
    .send({ from: userAccount })
    .on("receipt", function(receipt) {
      $("#txStatus").text("Ate a kitty and spawned a new Zombie!");
      getZombiesByOwner(userAccount).then(displayZombies);
    })
    .on("error", function(error) {
      $("#txStatus").text(error);
    });
  },

  levelUp: function(zombieId) {
    $("#txStatus").text("Leveling up your zombie...");
    return App.contracts.ZombieOwnership.levelUp(zombieId)
    .send({ from: userAccount, value: web3.utils.toWei("0.001", "ether") })
    .on("receipt", function(receipt) {
      $("#txStatus").text("Power overwhelming! Zombie successfully leveled up");
    })
    .on("error", function(error) {
      $("#txStatus").text(error);
    });
  },

  getZombieDetails: function(id) {
    // var zombieOwnershipInstance;
    console.log('[getZombieDetails/id]' + id)
    // App.contracts.ZombieOwnership.deployed().then(function(instance) {
    //   zombieOwnershipInstance = instance;
    //   console.log('[zombieOwnershipInstance.zombies.call(id)]');
    //   // console.log(zombieOwnershipInstance.zombies.call(id));
    //   return zombieOwnershipInstance.zombies.call(id);
    // });
    return App.zombieOwnershipInstance.zombies.call(id);
  },

  zombieToOwner: function(id) {
    return App.contracts.ZombieOwnership.zombieToOwner(id).call();
  },

  getZombiesByOwner: function(owner) {
    // var zombieOwnershipInstance;
    console.log('[ow]' + owner);

    App.contracts.ZombieOwnership.deployed().then(function(instance) {
      App.zombieOwnershipInstance = instance;
      console.log('[zombieOwnershipInstance.getZombiesByOwner.call(owner)]');// + App.zombieOwnershipInstance.getZombiesByOwner.call(owner));
      console.log(App.zombieOwnershipInstance.getZombiesByOwner.call(owner));
      return App.zombieOwnershipInstance.getZombiesByOwner.call(owner);
    }).then(function(ids){
      console.log('[ids]' + ids);
      // console.log('[displayZombies]' + App.displayZombies(ids));
      App.displayZombies(ids);
    });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];
      // console.log(account);
    
      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;
    
        // Execute adopt as a transaction by sending account
        return adoptionInstance.adopt(petId, {from: account});
      }).then(function(result) {
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
