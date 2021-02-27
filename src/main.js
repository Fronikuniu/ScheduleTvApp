import { mapListToDOMElements, createDOMElem } from './DOMActions.js';
import { getShowsByKey, getShowById } from './apiService.js';

class TvApp {

    constructor() {
        this.viewElems = {};
        this.showNameButtons = {};
        this.selectedName = "";
        this.initializeApp();
    }

    initializeApp = () => {
        this.connectDOMElements();
        this.setupListeners();
        this.fetchAndDisplayShows();
    }

    connectDOMElements = () => {
        const listOfIds = Array.from(
            document.querySelectorAll('[id]')
        ).map(elem => elem.id);

        const listOfShowNames = Array.from(
            document.querySelectorAll('[data-show-name]')
        ).map(elem => elem.dataset.showName);
        
        this.viewElems = mapListToDOMElements(listOfIds, 'id');
        this.showNameButtons = mapListToDOMElements(listOfShowNames, 'data-show-name');
    }

    setupListeners = () => {
        Object.keys(this.showNameButtons).forEach(showName => {
            this.showNameButtons[showName].addEventListener('click', this.setCurrentNameFilter);
        })
    }

    setCurrentNameFilter = () => {
        this.selectedName = event.target.dataset.showName;
        this.fetchAndDisplayShows();
    }
    
    fetchAndDisplayShows = () => {
        getShowsByKey(this.selectedName).then(shows => this.renderCardsOnList(shows));
    }

    renderCardsOnList = shows => {
        Array.from(
            document.querySelectorAll('[data-show-id]')
        ).forEach(btn => btn.removeEventListener('click', this.openDetailsView))

        this.viewElems.showsWrapper.innerHTML = '';
    
        for (const { show } of shows) {
            const card = this.createShowCard(show);
            this.viewElems.showsWrapper.appendChild(card);
        }
    }

    closeDetailsView = event => {
        const { showId } = event.target.dataset;
        const closeBtn = document.querySelector(`[id="showPreview"] [data-show-id="${showId}"]`);
        closeBtn.removeEventListener('click', this.closeDetailsView);
        this.viewElems.showPreview.style.display = 'none';
        this.viewElems.showPreview.innerHTML = '';
        document.body.style.overflowY = "scroll";
    }

    openDetailsView = event => {
        const { showId } = event.target.dataset;
        getShowById(showId).then(show => {
            const card = this.createShowCard(show, true);
            this.viewElems.showPreview.appendChild(card);
            this.viewElems.showPreview.style.display = 'block';
            document.body.style.overflowY = "hidden";
        })
    }

    createShowCard = (show, isDetailed) => {
        const divCard = createDOMElem('div', 'card');
        const divCardBody = createDOMElem('div', 'card-body');
        const h5 = createDOMElem('h5', 'card-title', show.name);
        let img, p, btn;

        if (show.image) {
            if (isDetailed) {
                img = createDOMElem('div', 'card-preview-bg');
                img.style.backgroundImage = `url('${show.image.original}')`;
            } else {
                img = createDOMElem('img', 'card-img-top', null, show.image.medium);
            }
        } else {
            img = createDOMElem('img', 'card-img-top placeholder', null, 'https://via.placeholder.com/210x295');
        }

        const regex = /<p>|<\/p>|<i>|<\/i>|<b>|<\/b>/gm;                //
        const subst = ``;                                               //
        const summary = show.summary;                                   //
        let result;                                                     //
        if (summary == null) {                                          // Usuniecie znaczników z opisu
            result = 'There is no summary for that show yet';           //
        } else {                                                        //
            result = summary.replace(regex, subst);                     //
        }                                                               //
        
        if (isDetailed) {
            btn = createDOMElem('button', 'btn btn-danger btn-card', 'Back to schedule');
            p = createDOMElem('p', 'card-text', result);
        } else {
            btn = createDOMElem('button', 'btn btn-primary btn-card', 'Show details');
            p = createDOMElem('p', 'card-text', `${result.slice(0, 90)} ...`);
        }

        btn.dataset.showId = show.id;

        if (isDetailed) {
            btn.addEventListener('click', this.closeDetailsView);
        } else {
            btn.addEventListener('click', this.openDetailsView);
        }

        divCard.appendChild(divCardBody);
        divCardBody.appendChild(img);
        divCardBody.appendChild(h5);
        divCardBody.appendChild(p);
        divCardBody.appendChild(btn);

        return divCard;
    }
}

document.addEventListener('DOMContentLoaded', new TvApp());

//zmiana napisu buttona                                 </
//scroll wylaczony gdy jest otwarte okno details        </
//PAGINACJA TO STRONY PRODUKTÓW                         X
//usuniecie znaczników z opisów - Reg exp, funkcje js   </
//ustawienie przycisków na tej samej wysokosci          </
//dodanie inputa zamiast select                         X
//dodanie obsady                                        X
//ulubione *                                            X
//placeholder - Czesciowo naprawiony placeholder        <-/
//Infinity scroll                                       X
