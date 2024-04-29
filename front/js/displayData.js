

let dataFromServer = [];

let img = document.querySelector(".imgToTest")



// получаем данные с БД
async function getData() {
    await fetch("http://localhost:3000/showData")
    .then(response => response.json())
    .then(data => {
        console.log(data)
        // беру последний єлемент массива с base64 строками
        img.src=data[data.length -1].imagesBase64[0]       
        
    })
   
    
}















getData()

