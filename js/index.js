document.addEventListener('DOMContentLoaded', () => {

    // Credits button
    document.querySelector("#credits-button").addEventListener("click", function (){
        let button = this;
        let container = document.querySelector(".container");
        let credits = feedbackPanel(container, button);
        let feedbackContent = document.querySelector(".feedback-content");
        
        button.disabled = true;
        feedbackContent.addElement("p", "id= class=credits-title", "Realizado por:");
        feedbackContent.addElement("p", "id= class=credits-p", "Jon Karla Somoza");
        feedbackContent.addElement("img", "id= class=credits-img", "./img/bbk_logo.png");
        credits.addElement("img", "id= class=credits-background", "./img/credits_background.png");
    })

    // Load game button
    document.querySelector("#load-game").addEventListener("click", function (){
        let button = this;
        let container = document.querySelector(".container");
        let savedGames = localStorage.getItem("savedGames");
        
        if(savedGames) {
            let feedback = feedbackPanel(container, button);
            let feedbackContent = document.querySelector(".feedback-content");
            feedback.classList.add("saved-games-list");
            feedbackContent.addElement("p", "id= class=", "Seleccionar partida");
            let gameList = feedbackContent.addElement("ul");
            let feedbackButton = feedback.addElement("button", "id= class=", "Cargar");
            
            savedGames = JSON.parse(savedGames);
            savedGames.forEach(element => {
                let game = gameList.addElement("li", "id= class=", element.gameName);
                game.addEventListener("click", function () {
                    let selectedGame = document.querySelector(".feedback-profile-selected");

                    if (selectedGame) {
                        selectedGame.classList.remove("feedback-profile-selected");
                    }

                    game.classList.add("feedback-profile-selected");
                })
            })

            feedbackButton.addEventListener("click", function () {
                let selectedGame = document.querySelector(".feedback-profile-selected").innerHTML;
                let selectedGameIndex = savedGames.searchInArrayOfObjects("gameName", selectedGame);
                window.location.href = "./game.html?game=" + selectedGameIndex;
            })

        } else {
            feedbackPanel(container, button);
            let feedbackContent = document.querySelector(".feedback-content");
            feedbackContent.addElement("p", "id= class=", "No hay partidas guardadas");
        }
    })
})