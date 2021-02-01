document.addEventListener('DOMContentLoaded', () => {
    let gameConfig = {
        "player1": {
            "name": "",
            "avatar": "",
            "pieces": {
                "king": {
                    "front": "",
                    "back": ""
                },
                "queen": {
                    "front": "",
                    "back": ""
                },
                "bishop": {
                    "front": "",
                    "back": ""
                },
                "rook": {
                    "front": "",
                    "back": ""
                },
                "knight": {
                    "front": "",
                    "back": ""
                },
                "pawn": {
                    "front": "",
                    "back": ""
                }
            }
        },
        "player2": {
            "name": "",
            "avatar": "",
            "pieces": {
                "king": {
                    "front": "",
                    "back": ""
                },
                "queen": {
                    "front": "",
                    "back": ""
                },
                "bishop": {
                    "front": "",
                    "back": ""
                },
                "rook": {
                    "front": "",
                    "back": ""
                },
                "knight": {
                    "front": "",
                    "back": ""
                },
                "pawn": {
                    "front": "",
                    "back": ""
                }
            }
        },
        "tiles": {
            "tile1": "",
            "tile2": ""
        }
    }

    let pokemonList = getPokemonList();

    avatarAutocomplete(document.querySelector("#player1-avatar"), 
                    document.querySelector("#player1-avatar-autocomplete"), pokemonList);

    avatarAutocomplete(document.querySelector("#player2-avatar"), 
                    document.querySelector("#player2-avatar-autocomplete"), pokemonList);

    document.querySelectorAll(".set-select").forEach(element => {
        element.addEventListener("change", function () {
            let select = this;
            let selectedSet = select.value;
            let player;
            let pokemonSet = getPokemonSet(selectedSet);
            let url = "https://pokeapi.co/api/v2/pokemon/";

            if (select.id === "player1-set-select") {
                player = "player1";
            } else if (select.id === "player2-set-select") {
                player = "player2";
            }

            getPokemonImage(gameConfig, player, url, pokemonSet.rook, "rook");
            getPokemonImage(gameConfig, player, url, pokemonSet.knight, "knight");
            getPokemonImage(gameConfig, player, url, pokemonSet.bishop, "bishop");
            getPokemonImage(gameConfig, player, url, pokemonSet.king, "king");
            getPokemonImage(gameConfig, player, url, pokemonSet.queen, "queen");
            getPokemonImage(gameConfig, player, url, pokemonSet.pawn, "pawn");
        })
    })

    document.querySelectorAll(".player-avatar-finder").forEach(element => {
        element.addEventListener("click", function (event) {
            event.preventDefault();
            let url = "https://pokeapi.co/api/v2/pokemon/";
            let avatarImg;
            let avatarInput;
    
            switch (element.id) {
                case "player1-avatar-finder":
                    avatarImg = document.querySelector("#player1-avatar-img");
                    avatarInput = document.querySelector("#player1-avatar").value;
                    avatarError = document.querySelector("#player1-avatar-error");
                    break;
                case "player2-avatar-finder":
                    avatarImg = document.querySelector("#player2-avatar-img");
                    avatarInput = document.querySelector("#player2-avatar").value;
                    avatarError = document.querySelector("#player2-avatar-error");
                    break;
            }
    
            getApiData(url + avatarInput).then(result => {
                if(result.response != undefined) {
                    if (result.response.status == "404") {
                        avatarError.classList.remove("hidden"); 
                        avatarImg.src = "";  
                    }
                } else {
                    avatarError.classList.add("hidden");
                    avatarImg.src = result.sprites.front_default;  
                }
            })
        })
    })
    
    document.querySelectorAll(".player-save").forEach(element => {
        element.addEventListener("click", function (event) {
            event.preventDefault();
            let button = this;
            let player;
    
            switch (element.id) {
                case "player1-save":
                    player = "player1";
                    break;
                case "player2-save":
                    player = "player2";
                    break;
            }
    
            let setSelection = document.querySelector("#" + player + "-set-select");
            let playerPanel = document.querySelector("#" + player + "-config");
    
            let newProfile = {
                "playerName": document.querySelector("#" + player + "-name").value,
                "playerAvatar": document.querySelector("#" + player + "-avatar").value,
                "playerSet": setSelection.options[setSelection.selectedIndex].value,
                "pieces": {
                    "king": {
                        "front": "",
                        "back": ""
                    },
                    "queen": {
                        "front": "",
                        "back": ""
                    },
                    "bishop": {
                        "front": "",
                        "back": ""
                    },
                    "rook": {
                        "front": "",
                        "back": ""
                    },
                    "knight": {
                        "front": "",
                        "back": ""
                    },
                    "pawn": {
                        "front": "",
                        "back": ""
                    }
                }
            }

            for (piece in gameConfig[player]["pieces"]) {
                newProfile.pieces[piece].front = gameConfig[player]["pieces"][piece].front;
                newProfile.pieces[piece].back = gameConfig[player]["pieces"][piece].back;
            }

            let localProfiles = localStorage.getItem("playerProfiles");
            let profileExists;
    
            if(localProfiles) {
                localProfiles = JSON.parse(localProfiles);
                profileExists = localProfiles.searchInArrayOfObjects("playerName", newProfile.playerName);
            } else {
                localProfiles = [];
                profileExists = -1;
            }
            
            if (profileExists >= 0) {
                feedback = feedbackPanel(playerPanel, button);
                let feedbackContent = document.querySelector(".feedback-content");
                feedbackContent.addElement("p", "id= class=", "El perfil de ese jugador ya existe");
                let feedbackButton = feedback.addElement("button", "id= class=", "Sobreescribir");
                feedbackButton.addEventListener("click", function () {
                    localProfiles.splice(profileExists, 1, newProfile);
                    localProfiles = JSON.stringify(localProfiles);
                    localStorage.setItem("playerProfiles", localProfiles);
                    button.disabled = false;
                    feedback.remove();
                })
            } else {
                localProfiles.push(newProfile);
                localProfiles = JSON.stringify(localProfiles);
                localStorage.setItem("playerProfiles", localProfiles);
                feedbackPanel(playerPanel, button);
                let feedbackContent = document.querySelector(".feedback-content");
                feedbackContent.addElement("p", "id= class=", "Perfil guardado");
            }
        })
    })
    
    document.querySelectorAll(".player-load").forEach(element => {
        element.addEventListener("click", function (event) {
            event.preventDefault();
            let button = this;
            let player;
    
            switch (element.id) {
                case "player1-load":
                    player = "player1";
                    break;
                case "player2-load":
                    player = "player2";
                    break;
            }
    
            let playerPanel = document.querySelector("#" + player + "-config");
            let localProfiles = localStorage.getItem("playerProfiles");
    
            if(localProfiles) {
                let feedback = feedbackPanel(playerPanel, button);
                let feedbackContent = document.querySelector(".feedback-content");
                feedbackContent.addElement("p", "id= class=", "Seleccionar perfil");
                let profileList = feedbackContent.addElement("ul");
                let feedbackButton = feedback.addElement("button", "id= class=", "Cargar");
                
                localProfiles = JSON.parse(localProfiles);
                localProfiles.forEach(element => {
                    let profile = profileList.addElement("li", "id= class=", element.playerName);
                    profile.addEventListener("click", function () {
                        let selectedProfile = document.querySelector(".feedback-profile-selected");
    
                        if (selectedProfile) {
                            selectedProfile.classList.remove("feedback-profile-selected");
                        }
    
                        profile.classList.add("feedback-profile-selected");
                    })
                })
    
                feedbackButton.addEventListener("click", function () {
                    let selectedProfile = document.querySelector(".feedback-profile-selected").innerHTML;
                    let localProfiles = localStorage.getItem("playerProfiles");                
                    localProfiles = JSON.parse(localProfiles);
                    let selectedProfileIndex = localProfiles.searchInArrayOfObjects("playerName", selectedProfile);
                    document.querySelector("#" + player + "-name").value = localProfiles[selectedProfileIndex].playerName;
                    document.querySelector("#" + player + "-avatar").value = localProfiles[selectedProfileIndex].playerAvatar;
                    document.querySelector("#" + player + "-set-select").value = localProfiles[selectedProfileIndex].playerSet;
    
                    let avatarSearch = document.querySelector("#" + player + "-avatar-finder");
                    avatarSearch.click();

                    document.querySelectorAll("." + player + "-set .set-piece .set-piece-image").forEach(element => {
                        let pieceType = element.id.substring(element.id.indexOf("-") + 1);
                        
                        element.src = localProfiles[selectedProfileIndex].pieces[pieceType].front;

                        gameConfig[player]["pieces"][pieceType].front = localProfiles[selectedProfileIndex].pieces[pieceType].front;
                        gameConfig[player]["pieces"][pieceType].back = localProfiles[selectedProfileIndex].pieces[pieceType].back;
                    })
    
                    button.disabled = false;
                    feedback.remove();
                })
            } else {
                feedbackPanel(playerPanel, button);
                let feedbackContent = document.querySelector(".feedback-content");
                feedbackContent.addElement("p", "id= class=empty-feedback", "No hay perfiles disponibles");
            }
        })
    })
    
    document.querySelectorAll(".player-ok").forEach(element => {
        element.addEventListener("click", function (event) {
            event.preventDefault();
            let button = this;
            let player;
    
            switch (element.id) {
                case "player1-ok":
                    player = "player1";
                    break;
                case "player2-ok":
                    player = "player2";
                    break;
            }

            gameConfig[player].name = document.querySelector("#" + player + "-name").value;
            gameConfig[player].avatar = document.querySelector("#" + player + "-avatar-img").src;
            button.classList.add("player-ok-checked");
        })
    })
    
    document.querySelectorAll(".tile-check").forEach(element => {
        element.addEventListener("change", function () {
            let tileList = document.querySelectorAll(".tile-check");
            let checked = 0;
    
            tileList.forEach(element => {
                if (element.checked) {
                    checked++;
                }
            })
    
            if (checked >= 2) {
                tileList.forEach(element => {
                    if (!element.checked) {
                        element.disabled = true;
                    }
                })
            } else {
                tileList.forEach(element => {
                    if (!element.checked) {
                        element.disabled = false;
                    }
                })
            }
        })
    })
    
    document.querySelector("#start-game-button").addEventListener("click", function () {
        let startButton = this;
        let tileList = document.querySelectorAll(".tile-check");
        let playerOk = document.querySelectorAll(".player-ok");
        let tileChecked = [];
        let playerCheck = true;
        let tileCheck = true;
        let i = 0;
    
        tileList.forEach(element => {
            if (element.checked) {
                tileChecked[i] = element;
                i++;
            }
        })
    
        if (tileChecked.length == 2) {
            gameConfig.tiles.tile1 = tileChecked[0].value + ".png";
            gameConfig.tiles.tile2 = tileChecked[1].value + ".png";

            playerOk.forEach(element => {
                if (!element.classList.contains("player-ok-checked")) {
                    playerCheck = false;
                }
            })
    
            if (!playerCheck) {
                let container = document.querySelector(".tile-selection");
                feedbackPanel(container, startButton);
                let feedbackContent = document.querySelector(".feedback-content");
                feedbackContent.addElement("p", "id= class=check-error", "Ambos jugador deben estar listos.");
            }   
        } else {
            tileCheck = false;
            let container = document.querySelector(".tile-selection");
            feedbackPanel(container, startButton);
            let feedbackContent = document.querySelector(".feedback-content");
            feedbackContent.addElement("p", "id= class=check-error", "Por favor, selecciona 2 casillas de terreno.");
        }

        if (playerCheck && tileCheck) {
            gameConfig = JSON.stringify(gameConfig);
            localStorage.setItem("gameConfig", gameConfig);
            window.location.href = "./game.html";
        }
    })

    document.querySelectorAll(".set-change-button").forEach(element => {
        element.addEventListener("click", function (event) {
            event.preventDefault();
            let buttonId = this.id.split("-");
            let player = buttonId[0];
            let piece = buttonId[1];
            let pieceImg = player + "-" + piece;
            let setImg = document.querySelector("#" + pieceImg);
            let url = "https://pokeapi.co/api/v2/type/";
            let setName = document.querySelector("#" + player + "-set-select").value;

            let container = document.querySelector("#" + player + "-config");
            let feedback = feedbackPanel(container);
            feedback.classList.add("set-change-panel");
            let feedbackContent = document.querySelector(".feedback-content");
            feedbackContent.addElement("p", "id= class=", "Selecciona el pokemon deseado:");
            let feedbackList = feedbackContent.addElement("ul", "id= class=set-change-list");
            let feedbackButton = feedback.addElement("button", "id= class=", "Cambiar");
            feedbackButton.addEventListener("click", function () {
                let frontImg = document.querySelector(".set-change-selected #change-front-img");
                let backImg = document.querySelector(".set-change-selected #change-back-img");
                if(frontImg && backImg) {
                    gameConfig[player]["pieces"][piece].front = frontImg.src;
                    gameConfig[player]["pieces"][piece].back = backImg.src;
                    setImg.src = frontImg.src;
                    feedback.remove();
                }
            })
            getApiData(url).then(result => {
                setIndex = result.results.searchInArrayOfObjects("name", setName);
                getApiData(result.results[setIndex].url).then(result => {
                    result.pokemon.forEach(element => {
                        getApiData(element.pokemon.url).then(result => {
                            let front = result.sprites.front_default;
                            let back = result.sprites.back_default;
                            if (front != null && back != null) {
                                feedbackElement = feedbackList.addElement("li", "id= class=set-change-li");
                                feedbackElement.addEventListener("click", function () {
                                    document.querySelectorAll(".set-change-li").forEach(element => {
                                        element.classList.remove("set-change-selected");
                                    })
                                    this.classList.add("set-change-selected");
                                })
                                feedbackElement.addElement("img", "id=change-front-img class=set-change-img", front);
                                feedbackElement.addElement("img", "id=change-back-img class=set-change-img hidden", back);
                            }
                        })
                    })
                })
            })
        })
    })

    document.querySelector(".mobile-nav-link").addEventListener("click", function(){
        document.querySelector(".mobile-nav-dropdown").style.display = "block";
    })
    
    document.querySelector("#credits-button").addEventListener("click", function (){
        let button = this;
        let container = document.querySelector(".container");
        let credits = feedbackPanel(container, button);
        let feedbackContent = document.querySelector(".feedback-content");

        feedbackContent.addElement("p", "id= class=credits-title", "Realizado por:");
        feedbackContent.addElement("p", "id= class=credits-p", "Jon Karla Somoza");
        feedbackContent.addElement("img", "id= class=credits-img", "./img/bbk_logo.png");
        credits.addElement("img", "id= class=credits-background", "./img/credits_background.png");
    })

})

function getPokemonSet(set) {
    switch (set) {
        case "electric":
            return electricSet;
        case "ice":
            return iceSet;
        case "fire":
            return fireSet;
        case "water":
            return waterSet;
        case "dragon":
            return dragonSet;
        case "psychic":
            return psychicSet;
    }
}

function getPokemonImage(gameConfig, player, url, pokemon, pieceType) {
    getApiData(url + pokemon).then(result => {
        setPokemonImage(player, pieceType, result.sprites.front_default);
        gameConfig[player]["pieces"][pieceType].front = result.sprites.front_default;
        gameConfig[player]["pieces"][pieceType].back = result.sprites.back_default;
    })
}

function setPokemonImage(player, pieceType, pokemonImg) {
    let pieceImg = document.querySelector("." + player + "-set > .set-piece > .img-" + pieceType);
    pieceImg.src = pokemonImg;
}

function getPokemonList() {
    pokemonList = [];
    i = 0;
    getApiData("https://pokeapi.co/api/v2/pokemon/?limit=1118").then(result => {
        result.results.forEach(element => {
            pokemonList[i] = element.name;
            i++;
        })
    });
    return pokemonList;
}

function avatarAutocomplete(avatarInput, avatarAutocomplete, pokemonList) {
    avatarInput.addEventListener("input", function (e) {
        let inputText = avatarInput.value;

        closeAllLists();
        if (!inputText) { return false; }
        currentFocus = -1;
        let avatarAutocompleteList = avatarAutocomplete.addElement("ul", "id= class=avatar-autocomplete-list");

        pokemonList.forEach(element => {
            if (element.substr(0, inputText.length).toUpperCase() == inputText.toUpperCase()) {
                let innerHTML = "<span class='bold'>" + element.substr(0, inputText.length) + "</span>";
                innerHTML += element.substr(inputText.length);
                innerHTML += "<input type='hidden' value='" + element + "'>";

                let avatarItem = avatarAutocompleteList.addElement("li", "id= class=", innerHTML);

                avatarItem.addEventListener("click", function (e) {
                    avatarInput.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                });
            }
        });
    });

    function closeAllLists() {
        let avatarAutocompleteList = document.querySelectorAll(".avatar-autocomplete-list");
        if (avatarAutocompleteList) {
            avatarAutocompleteList.forEach (element => {
                element.remove();
            })            
        }
    }

    document.addEventListener("click", function () {
        closeAllLists();
    });
}



