const form = document.querySelector("#form");
let dropButton = document.querySelector("#drop-button");
let sendButton = document.querySelector('#send-button');
const revisitForm = document.querySelector('#newRevisit');

const toggleSections = document.querySelector("#toggle-section"),
      numbersPanel = document.querySelector("#numbers-panel"),
      revisitPanel = document.querySelector("#revisit-panel");

toggleSections.addEventListener("click", toggleSection)

document.addEventListener('DOMContentLoaded', e => {
    
    const data = localStorage;

    if ( data.length > 0 ) {

        let numbers = [];

        for( let value in data ) {
            
            if ( value === 'key' || value === 'getItem' || value === 'setItem' || value === 'removeItem' || value === 'length' || value === 'clear' || value === 'newRevisitNumber' ) {
                null
            } else {

                // Ordenar numeros y colocar en array
                numbers.push(parseInt(value));
            }

        }

        // Procesar el array fuera del for in
        let numbersInOrder = numbers.sort(function (a, b){
            return a - b;
        });

        let container = document.querySelector('#numbers-list')

        numbersInOrder.forEach( element => {
            
            const value = JSON.parse(localStorage.getItem(element));
            const stringElement = element.toString();
            
            let style = '';
            
            if( value.isBusy ) {
                style = 'busy';
            }

            if( value.isUnavailable ) {
                style = 'unavailable';
            }

            if( value.isRevisit ) {
                style = 'revisit';
            }

            if( !value.isBusy && !value.isUnavailable && !value.isRevisit ) {
                style = '';
            }

            container.innerHTML += `
                            <div class="theme-number theme-number-${stringElement.substring(1)} card ${style}">
                                <div class="card-body d-flex align-items-center justify-content-between">
                                    <span>
                                        ${stringElement.substring(1)}
                                    </span>
                                    <div class="theme-actions d-flex align-items-stretch">
                                        <i class="bi bi-arrow-repeat"></i>
                                        <i class="bi bi-person-plus-fill" data-bs-toggle="modal" data-bs-target="#newRevisitModal"></i>
                                        <i class="bi bi-telephone-x-fill"></i>
                                        <i class="bi bi-x"></i>
                                    </div>
                                </div>
                            </div>
                            `;

        } )

        const cards = Array.from(document.querySelectorAll('.theme-number > div'));
        cards.forEach( card => card.addEventListener('click', setState) );

        dropButton.classList.remove('d-none');
        sendButton.classList.add('d-none');

    }

});

form.addEventListener('submit', e => {
    
    // Prevenimos la acción por defecto
    e.preventDefault();

    const data = {
        first_value: e.target.from_number.value,
        second_value: e.target.to_number.value
    }

    if ( data.first_value.length > 0 && data.second_value.length > 0 ) {
        
        const first_value_int = parseInt(data.first_value),
              second_value_int = parseInt(data.second_value);

        if ( second_value_int <= first_value_int ) {
            alert('El segundo valor no puede ser menor al primero. Por favor, vuelva a intentarlo');
            return;
        }
        
        listNumbers( '#numbers-list', first_value_int, second_value_int );
        
        for ( let i = first_value_int; i <= second_value_int; i++) {
            setItemToLocalStorage('10'+i);
        }

        const cards = Array.from(document.querySelectorAll('.theme-number > div'));
        cards.forEach( card => card.addEventListener('click', setState) );
        
        dropButton.classList.remove('d-none');
        sendButton.classList.add('d-none');
    
    }

});

dropButton.addEventListener('click', e => {
    e.preventDefault();
    const parentList = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.nextElementSibling.children[0];
    parentList.innerHTML = '';
    localStorage.clear();
    dropButton.classList.add('d-none');
    sendButton.classList.remove('d-none');
});

function listNumbers( element, firstValue, secondValue ) {
    const container = document.querySelector(element);

    for ( let i = firstValue; i <= secondValue; i++) {

        container.innerHTML += `
                            <div class="theme-number theme-number-${'0'+i} card">
                                <div class="card-body d-flex align-items-center justify-content-between">
                                    <span>${'0'+i}
                                    </span>
                                    <div class="theme-actions d-flex align-items-stretch">
                                        <i class="bi bi-arrow-repeat"></i>
                                        <i class="bi bi-person-plus-fill" data-bs-toggle="modal" data-bs-target="#newRevisitModal"></i>
                                        <i class="bi bi-telephone-x-fill"></i>
                                        <i class="bi bi-x"></i>
                                    </div>
                                </div>
                            </div>
                            `;

    }

}

function setItemToLocalStorage( value ) {

    const data = {
        isUnavailable: false,
        isRevisit: false,
        isBusy: false
    }

    localStorage.setItem(value.toString(), JSON.stringify(data))

}

function setState( e ) {
    e.preventDefault();

    if ( e.target.classList.contains('bi-arrow-repeat') ) {

        setNumberState(
            e.target.parentElement.parentElement.parentElement,
            '',
            false,
            false,
            false
        );

    }
    
    if ( e.target.classList.contains('bi-person-plus-fill') ) {

        setNumberState(
            e.target.parentElement.parentElement.parentElement,
            'revisit',
            false,
            false,
            true
        );

    }

    if ( e.target.classList.contains('bi-telephone-x-fill') ) {

        setNumberState(
            e.target.parentElement.parentElement.parentElement,
            'busy',
            true,
            false,
            false
        );

    }

    if ( e.target.classList.contains('bi-x') ) {

        setNumberState(
            e.target.parentElement.parentElement.parentElement,
            'unavailable',
            false,
            true,
            false
        );

    }

}

function setNumberState( element, style = '', isBusy, isUnavailable, isRevisit ) {
    const number = element.children[0].children[0].textContent.trim();
    const savedValues = JSON.parse(localStorage.getItem('1'+number));

    savedValues.isBusy = isBusy;
    savedValues.isUnavailable = isUnavailable;
    savedValues.isRevisit = isRevisit;

    if( savedValues.isRevisit ) {
        removeAllClasses( element, style );
        localStorage.setItem('1'+number, JSON.stringify(savedValues));
        setRevisit( element );
    } else {
        removeAllClasses( element, style );
        localStorage.setItem('1'+number, JSON.stringify(savedValues));
    }

}

function removeAllClasses( element, style = '' ) {
    
    ( element.classList.contains('busy') ) ? element.classList.remove('busy') : '';
    ( element.classList.contains('revisit') ) ? element.classList.remove('revisit') : '';
    ( element.classList.contains('unavailable') ) ? element.classList.remove('unavailable') : '';
    ( style.length > 0 ) ? element.classList.add(style) : null;

}

function setRevisit( element ) {

    const number = element.children[0].children[0].textContent.trim(); 

    revisitForm.addEventListener( 'submit', e => {
        e.preventDefault();
    
        const data = {
            name: e.target.revisitName.value,
            talkAbout: e.target.talkAbout.value,
            questionToAnswer: e.target.questionToAnswer.value,
            otherData: e.target.otherData.value
        }
    
        // If name or talkAbout variables are undefined, return with any action.
        if( data.name.length <= 0 ) { alert('El nombre no puede estar vacío'); return; }
        if( data.talkAbout.length <= 0 ) { alert('El tema de conversiación no puede estar vacío'); return; }
        if( data.questionToAnswer == "" ) { data.questionToAnswer = "No hay datos"; }
        if( data.otherData == "" ) { data.otherData = "No hay datos"; }

        const numberData = [number, data];
        const stringNumberData = JSON.stringify(numberData);

        if( localStorage.getItem('revisit') == null ) {

            localStorage.setItem( 'revisit', )

        }
        
        /* const containerForm = document.querySelector('.theme-container-form'),
              card = document.createElement('div'),
              cardBody = document.createElement('div'),
              title = document.createElement('h4'),
              name = document.createElement('p'),
              talkAbout = document.createElement('p'),
              questionToAnswer = document.createElement('p'),
              otherData = document.createElement('p');
    
        card.classList.add('card');
        card.classList.add('mt-4');
        cardBody.classList.add('card-body');
    
        // Asign name
        title.textContent = `Revisita: ${number}`
        name.innerHTML = `<strong>Nombre:</strong><br>${data.revisitName}`;
        talkAbout.innerHTML = `<strong>Tema de conversación:</strong><br>${data.talkAbout}`;
        questionToAnswer.innerHTML = `<strong>Pregunta pendiente:</strong><br>${data.questionToAnswer}`;
        otherData.innerHTML = `<strong>Otros datos:</strong><br>${data.otherData}`;
    
        let arrElements = [title, name, talkAbout, questionToAnswer, otherData];
    
        arrElements.forEach( element => cardBody.appendChild(element) );
        card.appendChild(cardBody);
        containerForm.appendChild(card); */
        
    
    });

}

function toggleSection( e ) {

    // Prevent default behavior of the link
    e.preventDefault();
    const nextPage = e.target.innerText.trim().toLowerCase();

    if( nextPage == 'revisitas' ) {
        e.target.innerHTML = `Celulares <i class="bi bi-forward-fill"></i>`;
    } else {
        e.target.innerHTML = `Revisitas <i class="bi bi-forward-fill"></i>`;
    }

    numbersPanel.classList.toggle('hidden');
    revisitPanel.classList.toggle('hidden');

}