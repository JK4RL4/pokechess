//Add html element to DOM: elementFather.addElement(elementType, "id= class=", innerHTML)
Object.prototype.addElement = function (elementType, selector, innerHTML) {
    let elementFather = this;
    let htmlElement = document.createElement(elementType);
    let id, classes;
 
    if (selector) {
        id = selector.slice(selector.indexOf("id=") + 3, selector.indexOf(" "));
        classes = selector.slice(selector.indexOf("class=") + 6);
    }

    if (id) {
        htmlElement.id = id;
    }

    if (classes) {
        let classesArray = classes.split(" ");
        classesArray.forEach(element => {
            htmlElement.classList.add(element);
        })
    }

    if (innerHTML) {
        if (elementType === "img") {
            htmlElement.src = innerHTML;
        } else {
            htmlElement.innerHTML = innerHTML;
        }
    }

    elementFather.appendChild(htmlElement);
    return htmlElement;
}

//Return the data from an API: getApiData(url)
function getApiData(url) {
    return axios.get(url).then(response => response.data).catch(error => error);
}

//Search for a coincidence in an array of objects: object.searchInObject(propertySearched, dataSearched)
Object.prototype.searchInArrayOfObjects = function (propertySearched, dataSearched) {
    let arrayOfObjects = this;
    let found = false;
    let i = 0;

    do {
        if (arrayOfObjects[i][propertySearched] === dataSearched) {
            found = true;
        }
        i++;
    } while (i < arrayOfObjects.length && !found);

    if (found) {
        return --i;
    } else {
        return -1;
    }
}

//Create a feedback window: feedbackPanel (container)
function feedbackPanel (container, button) {
    let feedback = document.querySelector(".feedback-panel");
    let feedbackButton;

    if (feedback) {
        feedback.remove();
    } 
 
    feedback = container.addElement("div", "id= class=feedback-panel");
    feedback.addElement("div", "id= class=feedback-content");
    feedbackButton = feedback.addElement("button", "id= class=feedbackButton", "Volver");
    feedbackButton.addEventListener("click", function () {
  
        if (button) {
            button.disabled = false;
        }
        feedback.remove();
 
    })

    return feedback;
}

