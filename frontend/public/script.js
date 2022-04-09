const parseJSON = async (url) => {
    const response = await fetch (url)
    return response.json()
}

const userComponent = ({first_name, last_name, street, house_number, city, zip, country, intro}) => {
    return `
    <div>
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
    <div>
        <label for="fname">First name</label><br>
        <input type="text" class="fname" name="fname"><br>

        <label for="lname">Last name</label><br>
        <input type="text" class="lname" name="lname"><br>

        <label for="street">Street</label><br>
        <input type="text" class="street" name="street"><br>

        <label for="hnumber">House number</label><br>
        <input type="text" class="hnumber" name="hnumber"><br>

        <label for="city">City</label><br>
        <input type="text" class="city" name="city"><br>

        <label for="zip">Zip code</label><br>
        <input type="number" class="zip" name="zip" min="1000" max="99999"><br>

        <label for="country">Country</label><br>
        <input type="text" class="country" name="country"><br>

        <label for="intro">Introduction</label><br>
        <textarea name="textarea" class="intro" name="intro" placeholder = "About me"></textarea><br>

        <button class="buttonData">Save</button>
        <button class ="reset">Delete</button>
    </div>
    `
}

const pictureComponent = `
    <form id="form">
        <input type="text" name="title">
        <input type="file" name="picture">
        <button class=buttonPic>Send</button>
    </form>
`;


const loadEvent = async (e) => {


    const result = await parseJSON("/api/v1/profile")
    const rootElement = document.getElementById("root")
    
    rootElement.insertAdjacentHTML("beforeend", addUserComponent())

    rootElement.insertAdjacentHTML("afterend", pictureComponent);
    
    /* const resetBtn = e.target.querySelector(".reset") */
    const dataBtn = e.target.querySelector(".buttonData")
    const picBtn = e.target.querySelector(".buttonPic")
    
    const firstName = e.target.querySelector(".fname")
    const lastName = e.target.querySelector(".lname")
    const street = e.target.querySelector(".street")
    const houseNumber = e.target.querySelector(".hnumber")
    const city = e.target.querySelector(".city")
    const zip = e.target.querySelector(".zip")
    const country = e.target.querySelector(".country")
    const intro = e.target.querySelector(".intro")
        
/*  Empty all fields on button click (upload fails when activated):

    const inputFields1 = document.querySelector(".inputField1")
    const inputFields2 = document.querySelector(".inputField2")
    const inputFields3 = document.querySelector(".inputField3")
    const inputFields4 = document.querySelector(".inputField4")
    const inputFields5 = document.querySelector(".inputField5")
    const inputFields6 = document.querySelector(".inputField6")
    const inputFields7 = document.querySelector(".inputField7")
    const inputFields8 = document.querySelector(".inputField8")

    resetBtn.addEventListener("click", () => {
        inputFields1.value = ""
        inputFields2.value = ""
        inputFields3.value = ""
        inputFields4.value = ""
        inputFields5.value = ""
        inputFields6.value = ""
        inputFields7.value = ""
        inputFields8.value = ""
     })  */


    dataBtn.addEventListener("click", () => {


        const userData = {
            first_name: firstName.value,
            last_name: lastName.value,
            street: street.value,
            house_number: houseNumber.value,
            city: city.value,
            zip: zip.value,
            country: country.value,
            intro: intro.value,
        }
    
        fetch("/profile/new", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(userData)
            })
            .then(async data => {
                const user = await data.json()

                rootElement.innerHTML = userComponent(user)
            })        
    })

    const formElement = document.getElementById("form");

    formElement.addEventListener("submit", e => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", e.target.querySelector(`input[name="title"]`).value);
        formData.append("picture", e.target.querySelector(`input[name="picture"]`).files[0]);

        const fetchSettings = {
            method: "POST",
            body: formData
        };

        fetch("/", fetchSettings)
            .then(async data => {
                if (data.status === 200) {
                    const res = await data.json();

                    form.innerHTML = `<img src=upload/${res.pictureName}>`
                    console.dir(data);
                } 
            })
            .catch(error => {
                console.dir(error);
            })
    });
}

window.addEventListener("load", loadEvent)