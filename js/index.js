let innerWidthNavbar = $('.navbar-scroll').innerWidth();

$(window).ready(function () {
    $('.loadingScreen').fadeOut(1000)
    $('body').css('overflow', 'visible')
})

//navBar Scroll Side:

function myFunction(x) {
    x.classList.toggle("change");
    $('.navbar-scroll ').animate({ left: -innerWidthNavbar + 'px' }).toggle(1000)
    $('.icons').toggle(1000)
    $('.ul').toggle(1000)
}


function display(array) {
    let cartona = ``;
    for (let i = 0; i < array.length; i++) {
        cartona += `
        <div data-id="${array[i].idMeal}" class="card col-md-3">
            <div class="cardItem position-relative rounded-3">
                <img src="${array[i].strMealThumb}" class="rounded-3 img-fluid " alt="w-100">
                <div class="overlay">
                    <p class="mx-2 fs-1 fw-bold ">${array[i].strMeal}</p>
                </div>
            </div>
        </div>
        `
    }
    $('.rowData').removeClass('d-none');
    document.querySelector('.rowData').innerHTML = cartona;
    console.log('hello');
    console.log(array);
    getId()
}

async function displayForMainMeals() {

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
    let responseResult = await response.json();
    let result = responseResult.meals;
    console.log(result);
    display(result)
    getId();
}
displayForMainMeals()

async function displayForDetailsMainMeals(mealId) {
    let fetchRes = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    let result = await fetchRes.json();
    console.log(result);

    let detailsArray = result.meals[0];
    console.log(detailsArray);
    let cartona = ``;
    cartona += `
      <div class="col-md-4 text-light">
                <img src="${detailsArray.strMealThumb}" width="100%" alt="">
                <h2>${detailsArray.strMeal}</h2>
            </div>
            <div class="col-md-8 text-light">
                <h2>
                    Instructions
                </h2>
                <p class="fs-5">${detailsArray.strInstructions}</p>
                <h2>Area : ${detailsArray.strArea}</h2>
                <h2>Category :${detailsArray.strCategory}</h2>
                <h2 >Recipes :
                <ul class="list-unstyled list-inline">
                `
                for (let i = 1; i <= 20; i++) {
                    let ingredient = detailsArray[`strIngredient${i}`];
                    let measure = detailsArray[`strMeasure${i}`];
                    if (ingredient && measure !== '') {
                        cartona += `<li class="btn btn-primary m-2 px-2">${measure} ${ingredient}</li>`;
                    }}
                cartona+=`
                    </ul>
                    <a href="${detailsArray.strSource}" class="btn btn-success">Source</a>
                    <a href="${detailsArray.strYoutube}" class="btn btn-danger">Youtube</a>
                    </div>
            </div>
    
    `

    document.querySelector('.rowData').innerHTML = cartona;
    console.log(detailsArray);
    return detailsArray;
}

function getId() {
    $('.rowData .card').on('click', function () {
        console.log("hello");
        let cardId = $(this).attr('data-id');
        console.log(cardId);

        displayForDetailsMainMeals(cardId)
    })
}

async function displayForCategories() {
    try {
        const fetchRes = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
        const result = await fetchRes.json();
        const categories = result.categories;
        let cartona = ``;

        for (const category of categories) {
            cartona += `
                <div class="card col-md-3 bg-transparent">
                    <div data-id="${category.idCategory}" class="cardItem overflow-hidden position-relative rounded-3">
                        <img src="${category.strCategoryThumb}" class="rounded-3 w-100" alt="${category.strCategory}">
                        <div class="overlay ">
                            <h3 class="getCategoryName text-center fs-1 fw-bold">${category.strCategory}</h3>
                            <p class="px-2">${category.strCategoryDescription.slice(0, 100)}</p>
                        </div>
                    </div>
                </div>
            `;
        }

        document.querySelector('.rowData').innerHTML = cartona;

        getCatName()
    } catch (error) {
        console.error("Failed to fetch categories:", error);
    }
}

$('#categories').on('click', function () {
    displayForCategories();
})

async function getCatItems(catName) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${catName}`);
    console.log(response);
    let result = await response.json();
    let categoryArray = result.meals;
    console.log(categoryArray);
    await display(categoryArray);
}

function getCatName() {
    $('.card').on('click', function () {
        console.log('hello');
        let catname = $(this).find('.getCategoryName').text();
        console.log(catname);
        getCatItems(catname);
    })
}


async function displayForArea() {
    let fetchRes = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    let result = await fetchRes.json();
    let areaArray = result.meals;
    console.log(areaArray);
    let cartona = '';
    for (let i = 0; i < areaArray.length; i++) {
        cartona += `
            <div class="areaItem col-md-3 text-center bg-transparent">
                <div class="text-white">
                    <i class="fa-solid fa-house-laptop fa-4x"></i>
                    <h3 class="areaname py-2">${areaArray[i].strArea}</h3>
                </div>
            </div>
    `
    }
    document.querySelector('.rowData').innerHTML = cartona;
    getAreaName()
}

function getAreaName() {
    $('.areaItem').on('click', function () {
        $('.areaIitem').css(' bg-transparent', true)

        let areaNam = $(this).find('.areaname').text();
        console.log(areaNam);
        getAreaItems(areaNam)
    })
}

async function getAreaItems(area) {
    let fetchRes = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    let result = await fetchRes.json();
    let areaArray = result.meals;
    console.log(areaArray);
    display(areaArray)
}

$('#area').on('click', function () {
    displayForArea();
})


async function displayForIngredients() {
    let fetchRes = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    let result = await fetchRes.json();
    let ingrArray = result.meals;
    console.log(ingrArray);
    let cartona = '';
    for (let i = 0; i < ingrArray.length; i++) {
        if (ingrArray[i].strDescription !== null) {
            cartona += `
            <div class="col-md-3 ingredItem">
                <div class="text-white text-center">
                    <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                    <h3 class="ingredName py-2">${ingrArray[i].strIngredient}</h3>
                    <p>${ingrArray[i].strDescription.slice(0, 80)}</p>
                </div>
            </div>
            `
        }
    }
    document.querySelector('.rowData').innerHTML = cartona;
    getIngName()
}

async function getIngItems(ingredient) {
    let fetchRes = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    let result = await fetchRes.json();
    let ingArr = result.meals;
    console.log(ingArr);
    display(ingArr)
}

function getIngName() {
    $('.ingredItem').on('click', function () {
        console.log('hello');
        let ingredName = $(this).find('.ingredName').text();
        console.log(ingredName);
        getIngItems(ingredName)
    })
}


$('#ingredients').on('click', function () {
    displayForIngredients()
})

//search:
let searchByName = document.getElementById('searchByName');
let searchByFirstLetter = document.getElementById('searchByFirstLetter');

async function search(userInput){
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${userInput}`);
    let resultJson = await response.json();
    let result = resultJson.meals;
    console.log(result);
    display(result)
}

function displaySearch(){
    document.querySelector('.search').classList.remove('d-none');
    $('.search input').on('input', function(){
        let userInput = $(this).val();
        console.log($(this).val());
        search(userInput);
    })
}

$('#search').on('click', function(){
    displaySearch();
})

// Validation:

let userName = document.getElementById("userName")
let userEmail = document.getElementById("userEmail")
let userPhone = document.getElementById("userPhone")
let userAge = document.getElementById("userAge")
let userPass = document.getElementById("userPass")
let userRepass = document.getElementById("userRepass")

let userContainer = []

function ifValidation() {

    if (
        userName.classList.contains('is-valid') &&
        userEmail.classList.contains('is-valid') &&
        userPhone.classList.contains('is-valid') &&
        userAge.classList.contains('is-valid') &&
        userPass.classList.contains('is-valid') &&
        userRepass.classList.contains('is-valid')
    ) {

        var user = {
            name: userName.value, // iytb3 el value eli d5lalo
            Age: Number(userAge.value),
            Email: userEmail.value,
            phone: userPhone.value,
            pass: userPass.value,
            Repass: userRepass.value,
        }

        userContainer.push(user);

        localStorage.setItem("user", JSON.stringify(userContainer))

        console.log(userContainer);

        clearForm();

        $(this).remove('is-invalid');
        $(this).remove('is-valid');



    } else {
        alert("Wrong Data Please Enter Correct Data")
    }
}

function clearForm() {

    userName.value = null;
    userEmail.value = null;
    userAge.value = null;
    userPhone.value = null;
    userPass.value = null;
    userRepass.value = null;
}

function validationForm(ele) {

    // console.log(ele.nextElementSibling);

    var regex = {

        userName: /^[A-Z][a-z]{3,8}$/gi,
        userEmail: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
        userPhone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        userAge: /^(?:1[01][0-9]|120|1?[0-9]{1,2})$/,
        userPass: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        userRepass: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

    }

    if (regex[ele.id].test(ele.value)) {
        ele.classList.remove('is-invalid');
        ele.classList.add('is-valid');
        ele.nextElementSibling.classList.add('d-none');
    }
    else {
        ele.classList.remove('is-valid');
        ele.classList.add('is-invalid');
        ele.nextElementSibling.classList.remove('d-none');
    }

}

//