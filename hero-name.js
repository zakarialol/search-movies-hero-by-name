//selectors
let submitBtn = document.getElementById('submitBtn')
let searchInput = document.getElementById('inputBtn')
let liHolder = document.querySelector('.liHolder')
let searchForm = document.getElementById('searchForm')
let inputText = document.querySelector('.text-input')
let contentHolder = document.querySelector('.contentHolder')
let errorHolder = document.querySelector('.errorHolder')
let herosNamesArray = []
let heroes = []
let heroId;
let manyHerosDiv;
let oneheroDiv
//fetching function 
window.onload = fillLiHolderWithInfo
function fillLiHolderWithInfo(){
    let HerosUrl ='https://akabab.github.io/superhero-api/api/all.json';
    fetch(HerosUrl).then(res=>{
        if(!res.ok) throw new Error('something went wrong please try again')
        return res.json()
    }).then(res=>{
        heroes = res;
        fillHerosNamesFunc(res)
        //
        typeAndSearchfunc()
    }).catch(res=>{
        if(!navigator.onLine){
            showErrorFunc('check your internet')
        }else{
            showErrorFunc(res.message)
        }
    })

}
//function to show errous 
function showErrorFunc(msg){
    let modifiedMsg = msg.charAt(0).toUpperCase() + msg.slice(1)
    errorHolder.textContent = modifiedMsg
    setTimeout(()=>{errorHolder.textContent =''},3000)
}
//funtion to fill the arrya of heros 
function fillHerosNamesFunc(data){
    data.forEach(heroName => {
        herosNamesArray.push(heroName.name.toLowerCase())
    });
}
//function to run after type
function typeAndSearchfunc(){
    let finalRsult;
    searchInput.addEventListener('input',()=>{
        liHolder.classList.remove('hidden')
        let nameTyped = searchInput.value.trim()
        finalRsult = herosNamesArray.filter(heroName =>{
            return heroName.includes(nameTyped)
        })
        searchInput.value.trim()!== '' ? filtheLiHolderFunc(finalRsult) :  filtheLiHolderFunc([])
    })
}
//handle the displaying of the result when i type 

function filtheLiHolderFunc(finalArray){
    let contentForLiHolder =''
    liHolder.textContent = ''
    finalArray.forEach(sugg=>{
        contentForLiHolder += `<p>${sugg}</p>`
    })
    liHolder.innerHTML = contentForLiHolder
}
// addding click event to liholder
liHolder.addEventListener('click',(item)=>{
    if(item.target.tagName = 'p'){
        searchInput.value = item.target.textContent 
        liHolder.classList.add('hidden')
    }else{
        return ;
    }
})
// adding event to submit
searchForm.addEventListener('submit',submitFunc)
function submitFunc(event){
    event.preventDefault()
    if(inputText.value.trim() === ''){
        console.log('hi zakaria')
        showErrorFunc('type valid hero name')
        return
    }
    submitBtn.disabled = true
    filterByheroNameFunc(searchInput.value.trim())
}
//funtion to filter the heros selected
function filterByheroNameFunc(nameOfTheHero,idd){
    liHolder.classList.add('hidden')
    if(idd){
        console.log(heroes)
        let hero = heroes.filter(hero =>{
            return hero.id === Number(idd)
        })
        console.log(hero,'inside if the hero id is true')
        storyOftheHeroFunc(nameOfTheHero,hero)
        return
    }
    let hero = heroes.filter(hero =>{
        if(nameOfTheHero.slice(' ').length === 1){
            return hero.name.toLowerCase().split(' ')[0].includes(nameOfTheHero.toLowerCase())
        }else{
            return hero.name.toLowerCase().includes(nameOfTheHero.toLowerCase())
        }
    })
    storyOftheHeroFunc(nameOfTheHero,hero)
    // renderInTheDom(hero)
}
// functon when we click on a hero if ther are more than one 
function clickHero(manyHerosDiv){
    manyHerosDiv.addEventListener('click',(itm)=>{
        if(itm.target.closest(".hero-div")){
            let heroName =  itm.target.closest(".hero-div").dataset.name
            heroId =  itm.target.closest(".hero-div").id
            filterByheroNameFunc(heroName,heroId)
        }else{
            return
        }
    })
}
function catchhadleFunc(res){
        if(!navigator.onLine){
            showErrorFunc('check your internet')
        }else{
            showErrorFunc(res.message)
        }
}
//gittin the story from the wekipdea api
function storyOftheHeroFunc(HName,arr){
    //getting the hero story first
    let captalLizeTypedText = captalizeWord(HName.toLowerCase())
    let heroStoryFromWekipidiaUrl= `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(captalLizeTypedText)}`
    console.log('final url *_*' ,heroStoryFromWekipidiaUrl)
    fetch(heroStoryFromWekipidiaUrl).then(res => {
        if(!res.ok) throw new Error("fetch don't work");
        return res.json()
    }).then(res=>{
        console.log(res)
        let storyOfHero = res.extract
        renderInTheDom(arr,storyOfHero)
    }).catch(res=>{
        catchhadleFunc(res)
        if(!navigator.onLine){
            showErrorFunc('check your internet')
        }else{
            showErrorFunc(res.message)
        }
    }).finally(()=>{
            console.log('we entered the finally');
            submitBtn.disabled = false
            }
    )
}
function resetContentHolder(){
    if(oneheroDiv){
        oneheroDiv.remove()
    }
    if(heroId){
        manyHerosDiv.style.display = 'none'
    }
    else{
        contentHolder.textContent = ''
    }
}
// functon to render in the heros in the dom`
function renderInTheDom(heroesArray,storyOfHero){
        resetContentHolder()
        if(heroesArray.length > 1){
            gernirateHtmlForMiltipleHeroFuc(heroesArray , storyOfHero)
        }else if(heroesArray.length === 1){
            genirateHtmlForOneHeroFunc(heroesArray,storyOfHero)
        }else{
            showErrorFunc("we didn't find muched hero")
        }

}
//function to genirate the one hero info 
function genirateHtmlForOneHeroFunc(heroInfo,storyOfHero){
    let imgss = heroInfo[0].images
    let finalimages = Object.values(imgss)
    let oneHerohtml = `<div class = 'oneHeroDiv'>
                    <div class='closeBtnDiv'>
                        <button><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class ='containerForImg'>
                        <div class = 'imgHolder'>
                            <img src="${finalimages[0]}" alt="">
                        </div>
                        <p class='heroName'>${heroInfo[0].name}</p>
                    </div>
                    <p class= 'heroInfo' id = '${heroInfo[0].id}'>${storyOfHero}</p>
                </div>`
    contentHolder.insertAdjacentHTML('beforeend',oneHerohtml)
    oneheroDiv = document.querySelector('.oneHeroDiv')
    closeButtonFunc()
}
//
function closeButtonFunc(){
    contentHolder.addEventListener('click',(itm)=>{
        if(itm.target.closest('button')){
            itm.target.closest('button').parentElement.parentElement.remove()
            if(manyHerosDiv){
                manyHerosDiv.style.display = 'grid'
            }
        }else{
            return
        }
    })
}
//function for miltiple hero display 
function gernirateHtmlForMiltipleHeroFuc(heoresInfo){
    let herosHtml = '';
    heoresInfo.forEach(hero=>{
        let imageIcon = Object.values(hero.images)
        herosHtml += `<div class ='hero-div' id='${hero.id}' data-name = '${hero.name}'>
                        <div class ='heroFaceImg'>
                            <img src="${imageIcon[0]}" alt="hero-img">
                        </div>
                        <p class='herotitle'>${hero.name}</p>
                    </div>`
    })
    //creating a div to hold my return heroes
    manyHerosDiv = document.createElement('div')
    manyHerosDiv.classList = 'heroesDiv'
    manyHerosDiv.insertAdjacentHTML('afterbegin',herosHtml)
    contentHolder.appendChild(manyHerosDiv)
    clickHero(manyHerosDiv,heoresInfo)
}
// function to currect word tryped for wekipdea api
function captalizeWord(text){
    return text.split(' ').map(word=>{
        return word.charAt(0).toUpperCase() + word.slice(1)
    }).join(' ')
}
