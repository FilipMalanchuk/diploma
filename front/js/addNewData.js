let inputName = document.getElementById("name");
let inputSubmit = document.getElementById("submit");



inputSubmit.addEventListener('click', ()=>{
    console.log(inputName.value);
        fetch("http://localhost:3000/addingNewData",{
        method : "post",
        headers: {
            "Accept": 'application/json',
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            name: inputName.value
        })
    }).then(response => console.log(response));
})


