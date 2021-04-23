// import { mobMenu } from './mob-menu.js';
// import { sendQuestion } from './questions.js';


mobMenu();
// sendQuestion();

function mobMenu() {
    let mobMenu = document.querySelector('.menuMob');
    let menuBurger = document.querySelector('.burger');

    //Mobile-menu

    menuBurger.addEventListener('click touchstart', e => {
        let mobMenu = menuBurger.nextElementSibling;
        menuBurger.classList.toggle('close')
        mobMenu.classList.toggle('open');
    })
    menuBurger.addEventListener('click', e => {
        let mobMenu = menuBurger.nextElementSibling;
        menuBurger.classList.toggle('close')
        mobMenu.classList.toggle('open');
    })

    mobMenu.addEventListener('click touchstart', e => {
        mobMenu.classList.remove('open');
        menuBurger.classList.remove('close')
    })
    mobMenu.addEventListener('click', e => {
        mobMenu.classList.remove('open');
        menuBurger.classList.remove('close')
    })
}

let openQuestion = document.querySelectorAll('.plus');

let benefitsMob = document.querySelector('.benefits-mob')
let arrowLeft = document.querySelector('.arrowLeft');
let arrowRight = document.querySelector('.arrowRight');
let arrowLeftMob = document.querySelector('.arrowLeft-mob');
let arrowRightMob = document.querySelector('.arrowRight-mob');
let iframe = document.querySelectorAll('iframe');
let videoText1 = document.querySelector('.video-text');
let videoText0 = document.querySelector('.video-mob-text');
let sliderCounter = 0;
let benefitsTitle = document.querySelector('#benefits-title');
let benefitsSubTitle1 = document.querySelector('#benefits-subtitle1');
let benefitsSubTitle2 = document.querySelector('#benefits-subtitle2');
let benefit0 = document.querySelector('#oval0');
let benefit1 = document.querySelector('#oval1');
let benefit2 = document.querySelector('#oval2');
let videoSRC = [
    {
        text: '1. Cкільки безкоштовної землі належить кожному громадянину України',
        play: 'https://www.youtube.com/embed/eJD58QVQFyo?autoplay=1&enablejsapi=1&rel=0&mute=0',
        stop: 'https://www.youtube.com/embed/eJD58QVQFyo'
    },
    {
        text: '2. Існує декілька причин, коли українцю можуть відмовити у безкоштовній землі',
        play: 'https://www.youtube.com/embed/-BHlx0weJgk?autoplay=1&enablejsapi=1&rel=0&mute=0',
        stop: 'https://www.youtube.com/embed/-BHlx0weJgk'
    },
    {
        text: '3. Як знайти вільну земельну ділянку, щоб отримати її безоплатно!',
        play: 'https://www.youtube.com/embed/A-03JzEKBaY?autoplay=1&enablejsapi=1&rel=0&mute=0',
        stop: 'https://www.youtube.com/embed/A-03JzEKBaY'
    },
    {
        text: '4. Як знайти вільну земельну ділянку, щоб отримати її безоплатно!',
        play: 'https://www.youtube.com/embed/HIRue1F5sPs?autoplay=1&enablejsapi=1&rel=0&mute=0',
        stop: 'https://www.youtube.com/embed/HIRue1F5sPs'
    }
]

let benefits = [{
    title: 'Навчання та консультації щодо земельних питань',
    subtitle1: 'Інформуємо учасників щодо їх земельних прав наданих законодавством України.',
    subtitle2: 'Навчаємо, як скористатися цими правами. Надаємо консультації відносно конкретних ситуацій.'
},
{
    title: 'Організація зустрічей, акцій, заходів',
    subtitle1: 'Збираємо учасників разом у випадках чиновницького свавілля, захисту прав учасників,',
    subtitle2: 'формування законодавчих ініциатив та заради інших інтересів учасників'
},
{
    title: 'Підтримка та поширення діяльності',
    subtitle1: 'Щоденне спілкування у закритих чатах, отримання оперативних консультрацій, юридична та інша допомога.',
    subtitle2: 'Залучення нових учасників.'
},
]


//Questions 

openQuestion.forEach(item => {
    item.addEventListener('click', e => {
        let itemOpen = e.target.parentElement.nextElementSibling;
        itemOpen.classList.toggle('open')
    })
});

//Video Slider 
arrowRight.addEventListener('click', { handleEvent: changeSlider, direction: 'right', number: 1 });
arrowRightMob.addEventListener('click touchstart', { handleEvent: changeSlider, direction: 'right', number: 0 });
arrowRightMob.addEventListener('click', { handleEvent: changeSlider, direction: 'right', number: 0 });


arrowLeft.addEventListener('click', { handleEvent: changeSlider, direction: 'left', number: 1 });
arrowLeftMob.addEventListener('click touchstart', { handleEvent: changeSlider, direction: 'left', number: 0 });
arrowLeftMob.addEventListener('click', { handleEvent: changeSlider, direction: 'left', number: 0 });



function changeSlider() {
    let videoText = this.number ? videoText1 : videoText0;
    // greenCover.style.display = 'block';
    // play.style.display = 'block';
    // greenCoverMob.style.display = 'block';
    // playMob.style.display = 'block';
    if (this.direction === 'right') {
        if (sliderCounter === 3) {
            sliderCounter = 0;
        } else {
            sliderCounter++;
        }


        iframe[this.number].src = videoSRC[sliderCounter].stop;

        videoText.textContent = videoSRC[sliderCounter].text;
    } else if (this.direction === 'left') {
        if (sliderCounter === 0) {
            sliderCounter = 3;
        } else {
            sliderCounter--;
        }

        iframe[this.number].src = videoSRC[sliderCounter].stop;
        videoText.textContent = videoSRC[sliderCounter].text;
    }

};

/**
 * Benefits slider
 */

benefit0.addEventListener('click', e => {
    benefit0.classList.remove('oval-fill');
    benefit0.classList.add('oval');
    benefit2.classList.add('oval-fill');
    benefit1.classList.add('oval-fill');
    benefitsTitle.textContent = benefits[0].title;
    benefitsSubTitle1.textContent = benefits[0].subtitle1;
    benefitsSubTitle2.textContent = benefits[0].subtitle2;
})
benefit1.addEventListener('click', e => {
    benefit1.classList.remove('oval-fill');
    benefit1.classList.add('oval');
    benefit0.classList.add('oval-fill');
    benefit2.classList.add('oval-fill');
    benefitsTitle.textContent = benefits[1].title;
    benefitsSubTitle1.textContent = benefits[1].subtitle1;
    benefitsSubTitle2.textContent = benefits[1].subtitle2;
})

benefit2.addEventListener('click', e => {
    benefit2.classList.remove('oval-fill');
    benefit2.classList.add('oval');
    benefit0.classList.add('oval-fill');
    benefit1.classList.add('oval-fill');
    benefitsTitle.textContent = benefits[2].title;
    benefitsSubTitle1.textContent = benefits[2].subtitle1;
    benefitsSubTitle2.textContent = benefits[2].subtitle2;
})


/**
 * Benefits Experience and Questions Mob Version
 */

benefitsMob.addEventListener('click touchstart', e => {
    let element = e.target.textContent ? e.target : e.target.parentElement;
    element.nextElementSibling.classList.toggle('open')
})
benefitsMob.addEventListener('click', e => {
    let element = e.target.textContent ? e.target : e.target.parentElement;
    element.nextElementSibling.classList.toggle('open')
})

//Video PLAY

// const play = document.querySelector('.play');
// const playMob = document.querySelector('.play-mob');
// const greenCover = document.querySelector('.greenCover');
// const greenCoverMob = document.querySelector('.greenCover-mob');

// play.addEventListener('click', e => {
//     // greenCover.style.display = 'none';
//     // play.style.display = 'none';
//     iframe[0].src = videoSRC[sliderCounter].stop;
//     iframe[1].src = videoSRC[sliderCounter].play;
// })

// playMob.addEventListener('click touchstart', e => {
//     // greenCoverMob.style.display = 'none';
//     // playMob.style.display = 'none';
//     // videoText0.textContent = '';
//     iframe[1].src = videoSRC[sliderCounter].stop;
//     iframe[0].src = videoSRC[sliderCounter].play;

// })
// playMob.addEventListener('click', e => {
//     // greenCoverMob.style.display = 'none';
//     // playMob.style.display = 'none';
//     // videoText0.textContent = '';
//     // iframe[1].src = videoSRC[sliderCounter].stop;
//     iframe[0].src = videoSRC[sliderCounter].play;

// })



