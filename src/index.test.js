import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Window } from 'happy-dom'
import fs from 'fs'
import path from 'path'
import { fireEvent } from '@testing-library/dom'

//! Set the data

const testResponseData = [
    {
        "id": 1,
        "name": "Haven",
        "image": "./assests/Haven.jpg",
        "age": "2 years",
        "gender": "Female",
        "breed": "Tuxedo"
    },
    {
      "id": 2,
      "name": "Lilith",
      "image": "./assests/Lilith.jpg",
      "age": "6 years",
      "gender": "Female",
      "breed": "short hair black"
    },
    {
      "id": 3,
      "name": "Gremlin",
      "image": "./assests/Gremlin.jpg",
      "age": "6 years",
      "gender": "Male",
      "breed": "Tuxedo"
    },
    {
      "id": 4,
      "name": "Eclipse",
      "image": "./assests/Eclipse.jpg",
      "age": "2 years",
      "gender": "Female",
      "breed": "Tortoise shell tabby"
    },
    {
      "id": 5,
      "name": "Mozerella",
      "age": "6 months",
      "gender": "Male",
      "breed": "Tuxedo"
    }
    
];

vi.stubGlobal('testResponseData', testResponseData)

//! Set the DOM

const htmlDocPath = path.join(process.cwd(), 'index.html');
const htmlDocumentContent = fs.readFileSync(htmlDocPath).toString();
const window = new Window
const document = window.document
document.body.innerHTML = ''
document.write(htmlDocumentContent)
vi.stubGlobal('document', document)

//! Mock the Fetch API globally

const testFetch = vi.fn((url) => {
    return new Promise((resolve, reject) => {
        const testResponse = {
            ok: true,
            json() {
                return new Promise((resolve, reject) => {
                    resolve(testResponseData);
                });
            },
        };
        resolve(testResponse);
    });
});

vi.stubGlobal('fetch', testFetch);

import { addSubmitListener, displaycats, handleClick, main } from './index'

//! Test Suite

describe('displayCats', () => {

    it('should fetch all cats and display them as <img> inside #cat-menu', async () => {
        const catMenuDiv = document.getElementById('cat-menu');
        
        displaycats();
        await new Promise(resolve => setTimeout(resolve, 0));

        const catImages = catMenuDiv.querySelectorAll('img');
        const urls = Array.from(catImages).map((catImg) => catImg.src);
        const originalUrls = testResponseData.map((cat) => cat.image);

        expect(catImages.length).toEqual(testResponseData.length);
        expect(urls).toEqual(originalUrls);
    })
})

describe('handleClick', () => {
    it('should fire on a click on every img inside #cat-menu', async () => {
        const catMenuDiv = document.getElementById('cat-menu');
        const catImages = catMenuDiv.querySelectorAll('img');

        const handleClickSpy = vi.fn(handleClick);
        vi.stubGlobal('handleClick', handleClickSpy);

        catImages.forEach((catImg) => {
            const cat = testResponseData.find((cat) => cat.image === catImg.src);
            catImg.addEventListener('click', (event) => {
                handleClickSpy(cat, event);
            });
        });

        const img = catImages[0];
        fireEvent.click(img);

        expect(handleClickSpy).toHaveBeenCalled();
        expect(handleClickSpy).toHaveBeenCalledWith(testResponseData[0], expect.anything());

    });

    it('should append the correct data to the DOM', async () => {
        const catMenuDiv = document.getElementById('cat-menu');
        const catImages = catMenuDiv.querySelectorAll('img');

        const img = catImages[0]
        fireEvent.click(img);

        const detailImg = document.querySelector("#cat-detail > .detail-image");
        const detailName = document.querySelector("#cat-detail > .name");
        const detailAge = document.querySelector("#cat-detail > .Age");
        const detailsGender = document.getElementById("Gender-display");
        const detailsBreed = document.getElementById("Breed-display");

        expect(detailName.textContent).toBe('Haven');
        expect(detailAge.textContent).toBe('2 yeard');
        expect(detailImg.src).toBe('./assets/Haven.jpg');
        expect(detailsGender.textContent).toBe('Female');
        expect(detailsBreed.textContent).toBe("Tuxedo");
    });

})

describe('handleSubmit', () => {
    it('should add a new slider image when the submit button is clicked', async () => {
        const catForm = document.getElementById('new-cat');
        addSubmitListener(catForm)
        const newcat = {
            name: 'Mat',
            Age: 'Test',
            image: './assets/Haven.jpg',
            Gender: '4',
            Breed: 'test',
        }

        const catMenuDivBefore = document.querySelectorAll('#cat-menu img');
        const catFormName = document.querySelector("#new-cat #new-name");
        const catFormAge = document.querySelector("#new-cat #new-Age");
        const catFormImage = document.querySelector("#new-cat #new-image");
        const catFormGender = document.querySelector("#new-cat #new-Gender");
        const catFormBreed = document.querySelector("#new-cat #new-Breed");

        catFormName.value = newcat.name;
        catFormAge.value = newcat.Age;
        catFormImage.value = newcat.image;
        catFormGender.value = newcat.Gender;
        catFormBreed.value = newcat.Breed;
        console.log("🚀 ~ file: index.test.js:171 ~ ", catFormName.value, catFormAge.value, catFormImage.value, 
            catFormGender.value, catFormBreed.value)

        fireEvent.submit(catForm, {
            target: {
                name: { value: newcat.name },
                Age: { value: newcat.Age },
                image: { value: newcat.image },
                Gender: { value: newcat.Gender },
                Breed: { value: newcat.Breed },
            },
            preventDefault: vi.fn(),
            reset: vi.fn(),

        });

        const catMenuDivAfter = document.querySelectorAll('#cat-menu img');
        expect(catMenuDivAfter.length).toBe(catMenuDivBefore.length + 1);
        expect(catMenuDivAfter[catMenuDivBefore.length].src).toBe(newcat.image);
    });

    it('should attach a click listener to the new element to display its details', () => {
        const newcat = {
            name: 'Mat',
            Age: 'Test',
            image: './assets/Haven.jpg',
            Gender: '4',
            Breed: 'test',
            id: 6

        }
        const catMenuDivBefore = document.querySelectorAll('#cat-menu img');
        const catForm = document.getElementById('new-cat');
        const catFormName = document.querySelector("#new-cat #new-name");
        const catFormAge = document.querySelector("#new-cat #new-Age");
        const catFormImage = document.querySelector("#new-cat #new-image");
        const catFormGender = document.querySelector("#new-cat #new-Gender");
        const catFormBreed = document.querySelector("#new-cat #new-Breed");
        const submitButton = document.getElementById('submit-button');

        catFormName.value = newcat.name;
        catFormAge.value = newcat.Age;
        catFormImage.value = newcat.image;
        catFormGender.value = newcat.Gender;
        catFormBreed.value = newcat.Breed;

        fireEvent.submit(catForm, {
            target: {
                name: { value: newcat.name },
                Age: { value: newcat.Age },
                image: { value: newcat.image },
                Gender: { value: newcat.Gender },
                Breed: { value: newcat.Breed },
            },
            preventDefault: vi.fn(),
            reset: vi.fn(),

        });

        const catMenuDivAfter = document.querySelectorAll('#cat-menu img');
        const img = catMenuDivAfter[catMenuDivBefore.length];
        img.addEventListener('click', (event) => {
            handleClick(newcat, event);
        });
        fireEvent.click(img);

        const detailImg = document.querySelector("#cat-detail > .detail-image");
        const detailName = document.querySelector("#cat-detail > .name");
        const detailAge = document.querySelector("#cat-detail > .Age");
        const detailsGender = document.getElementById("Gender-display");
        const detailsBreed = document.getElementById("Breed-display");

        expect(detailName.textContent).toBe(newcat.name);
        expect(detailAge.textContent).toBe(newcat.Age);
        expect(detailImg.src).toBe(newcat.image);
        expect(detailsGender.textContent).toBe(newcat.Gender.toString());
        expect(detailsBreed.textContent).toBe(newcat.Breed);
    })
})