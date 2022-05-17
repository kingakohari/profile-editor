/* const parseJSON = async (url) => {
    const response = await fetch (url)
    return response.json()
} */

const userComponent = ({image_name, first_name, last_name, street, house_number, city, zip, country, intro}) => {
    return `
    <div id="userComponent">
        <img src="upload/${image_name}">
        <h1>${first_name} ${last_name}</h1>
        <p1>${street} ${house_number}</p1><br>
        <p1>${city}</p1><br>
        <p1>${zip}</p1><br>
        <p1>${country}</p1><br>
        <p>Introduction:<br>${intro}</p>
    </div>
    `
}

const addUserComponent = () => {
    return`
    <div id="editor">
        <form id="form">
            <label>First name</label><br>
            <input id="fname" type="text" class="inputField" name="fname"><br>

            <label>Last name</label><br>
            <input id="lname" type="text" class="inputField" name="lname"><br>

            <label>Street</label><br>
            <input id="street" type="text" class="inputField" name="street"><br>

            <label>House number</label><br>
            <input id="hnumber" type="text" class="inputField" name="hnumber"><br>

            <label>City</label><br>
            <input id="city" type="text" class="inputField" name="city"><br>

            <label>Zip code</label><br>
            <input id="zip" type="number" class="inputField" name="zip" min="1000" max="99999"><br>

            <label>Country</label><br>
            <input id="country" type="text" class="inputField" name="country"><br>

            <label>Introduction</label><br>
            <textarea id="intro" class="inputField" name="intro" placeholder="About me"></textarea><br>

            <label>Upload a profile picture</label><br>
            <input id="pic" type="file" name="picture">

            <button id="addUser" class="button">Save</button>
        </form>
        <button id="reset" class="button">Delete</button>
    </div>
    `
}

const loadEvent = async (e) => {


    const rootElement = document.getElementById("root")
    
    rootElement.insertAdjacentHTML("beforeend", addUserComponent())
    
    const formElement = document.getElementById("form")

    formElement.addEventListener("submit", (e) => {
        
        e.preventDefault();

        const formData = new FormData();
        
        formData.append("first_name", document.getElementById("fname").value);
        formData.append("last_name", document.getElementById("lname").value);
        formData.append("street", document.getElementById("street").value);
        formData.append("house_number", document.getElementById("hnumber").value);
        formData.append("city", document.getElementById("city").value);
        formData.append("zip", document.getElementById("zip").value);
        formData.append("country", document.getElementById("country").value);
        formData.append("intro", document.getElementById("intro").value);
        formData.append("picture", document.getElementById("pic").files[0]);
        

        const fetchSettings = {
            method: "POST",
            body: formData
        };

        fetch("/profile/new", fetchSettings)
            .then(async data => {
                if (data.status === 200) {
                    const res = await data.json();

                    rootElement.innerHTML = userComponent(res)
                    console.dir(data);
                } 
            })
            .catch(error => {
                console.dir(error);
            })
    });

    const inputFields = document.querySelectorAll(".inputField")
    const resetBtn = document.getElementById("reset")

    resetBtn.addEventListener("click", (e) => {

        e.preventDefault();

        inputFields.forEach(input => input.value = "")
        document.getElementById("pic").value ="" 

        fetch("/delete/", {
            method: "DELETE",
        })
        .then((res) => res.text()) // or res.json()
		.then((res) => console.log(res));
    })
}

window.addEventListener("load", loadEvent)