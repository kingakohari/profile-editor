const parseJSON = async (url) => {
    const response = await fetch (url)
    return response.json()
}

const userComponent = ({firstName, lastName}) => {
    return `
    <div>
        <h1>${firstName}</h1>
        <h2>${lastName}</h2>
    </div>
    `
}

const addUserComponent = () => {
    return`
    <form id="form">

        <input type="file" id="picture" name="picture"><br>

        <label for="fname">First name</label><br>
        <input type="text" id="fname" name="fname"><br>

        <label for="lname">Last name</label><br>
        <input type="text" id="lname" name="lname"><br>

        <label for="street">Street</label><br>
        <input type="text" id="street" name="street"><br>

        <label for="hnumber">House number</label><br>
        <input type="text" id="hnumber" name="hnumber"><br>

        <label for="city">City</label><br>
        <input type="text" id="city" name="city"><br>

        <label for="zip">Zip code</label><br>
        <input type="number" id="zip" name="zip" min="1000" max="99999"><br>

        <label for="country">Country</label><br>
        <input type="text" id="country" name="country"><br>

        <label for="intro">Introduction</label><br>
		<textarea name="textarea" id="intro" name="intro" placeholder = "About me"></textarea><br>

        <button>Save</button>
    </form>
`;

function loadEvent() {
    const rootElement = document.getElementById("root");

    rootElement.insertAdjacentHTML("beforeend", formComponent);

    const formElement = document.getElementById("form");
    formElement.addEventListener("submit", e => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("picture", e.target.querySelector("#picture").files[0]);
        formData.append("first_name", e.target.querySelector("#fname").value);
        formData.append("last_name", e.target.querySelector("#lname").value);
        formData.append("house_number", e.target.querySelector("#hnumber").value);
        formData.append("street", e.target.querySelector("#street").value);
        formData.append("city", e.target.querySelector("#city").value);
        formData.append("zip", e.target.querySelector("#zip").value);
        formData.append("country", e.target.querySelector("#country").value);
        formData.append("introduction", e.target.querySelector("#intro").value);

        const fetchSettings = {
            method: "POST",
            body: formData
        };

        fetch("/", fetchSettings)
            .then(async data => {
                if (data.status === 200) {
                    const res = await data.json();

                    e.target.outerHTML = `
                    <div>
                        <img src="upload/${res.pictureName}">
                        <h1>${formData.first_name} ${formData.last_name}</h1>
                        <p1>${formData.street} ${formData.house_number}</p1><br>
                        <p1>${formData.city}</p1><br>
                        <p1>${formData.zip}</p1><br>
                        <p1>${formData.country}</p1><br>
                        <p>${formData.introduction}</p>
                    </div>
                    `
                    ;

                    
                    console.dir(data);
                } 
            })
            .catch(error => {
                e.target.outerHTML = `Error`;
                console.dir(error);
            })
    });
}

window.addEventListener("load", loadEvent);
