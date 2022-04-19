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
    <div id="addUser">
        <label for="fname">First name</label><br>
        <input type="text" class="fname inputField" name="fname"><br>

        <label for="lname">Last name</label><br>
        <input type="text" class="lname inputField" name="lname"><br>

        <label for="street">Street</label><br>
        <input type="text" class="street inputField" name="street"><br>

        <label for="hnumber">House number</label><br>
        <input type="text" class="hnumber inputField" name="hnumber"><br>

        <label for="city">City</label><br>
        <input type="text" class="city inputField" name="city"><br>

        <label for="zip">Zip code</label><br>
        <input type="number" class="zip inputField" name="zip" min="1000" max="99999"><br>

        <label for="country">Country</label><br>
        <input type="text" class="country inputField" name="country"><br>

        <label for="intro">Introduction</label><br>
        <textarea name="textarea" class="intro inputField" name="intro" placeholder = "About me"></textarea><br>

        <button class="buttonData">Save</button>
        <button class="reset">Delete</button>
    </div>
    `
}

const pictureComponent = `
    <form id="form">
        <input type="text" class="inputField" name="title">
        <input id="pic" type="file" name="picture">
        <button class=buttonPic>Send</button>
    </form>
`;


const loadEvent = async (e) => {


    const result = await parseJSON("/api/v1/profile")
    const rootElement = document.getElementById("root")
    
    rootElement.insertAdjacentHTML("beforeend", addUserComponent())

    rootElement.insertAdjacentHTML("afterend", pictureComponent);
    
    const inputFields = e.target.querySelectorAll(".inputField")
    const resetBtn = e.target.querySelector(".reset") 
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
    
    let userData = {
        first_name: firstName.value,
        last_name: lastName.value,
        street: street.value,
        house_number: houseNumber.value,
        city: city.value,
        zip: zip.value,
        country: country.value,
        intro: intro.value,
    }

/* Empty all fields on button click: */

    resetBtn.addEventListener("click", event => {
        inputFields.forEach(input => input.value = "")
        document.getElementById("pic").value ="" 


        /* const removeFetchSettings = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify(userData)
        }

        fetch("/profile/delete", removeFetchSettings)
        .then(async data => {
            if (data.status === 200) {
                const res = await data.json();
                console.log(res.response);
            }
        })
        .catch(err => {
            console.log(err);
        })

        userData.remove(); */
    })

    

    
/*   Delete data from profile.json on click (works with bug):      
    resetBtn.addEventListener("click", event => {

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
            
        fetch("/profile/delete", {
            method: "POST",
             headers: {
                "Content-Type" : "application/json"
            }, 
            body: JSON.stringify(userData)
            })
            .then(async data => {
                if (data.status === 200) {
                    const user = await data.json()
                    
                    rootElement.innerHTML = "Your profile data has been deleted"             
            }
            
        })
        .catch(error => {
            console.dir(error);
        }) 
    }); */


    dataBtn.addEventListener("click", () => {

    
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

                    form.outerHTML = `<img src=upload/${res.pictureName}>`
                    console.dir(data);
                } 
            })
            .catch(error => {
                console.dir(error);
            })
    });
}

window.addEventListener("load", loadEvent)