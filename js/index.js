//JAVASCRIPT PAGE FOR GIFTR APP FOR MAD9023

let name = null;
let dob = null;
let baseURL = "http://localhost/giftr_api/";

var app = {

    KEY: 'iusi0001',

    personid: '',

    "people": [
//        {
//            "id": 827381263882763,
//            "name": "Jeff Bridges",
//            "dob": "1960-05-23",
//            "ideas": [
//                {
//                    "giftid": 12312312,
//                    "idea": "White Russian",
//                    "at": "LCBO",
//                    "cost": "",
//                    "url": "http://lcbo.com/"
//                    },
//                {
//                    "giftid": 43783673,
//                    "idea": "new Sweater",
//                    "at": "Value Village",
//                    "cost": "20.00",
//                    "url": ""
//                    }
//  ]
//            },f
//        {
//            "id": 19283719282833,
//            "name": "Walter Sobchak",
//            "dob": "1961-12-12",
//            "ideas": [
//                {
//                    "giftid": 87998878,
//                    "idea": "new briefcase",
//                    "at": "Staples",
//                    "cost": "50.00",
//                    "url": ""
//                    }
//  ]
//            }
],


    init: function () {

        //generating the device.Id




        //checking an update of local storage
        if (localStorage.getItem(app.KEY)) {
            app.updatePeople();
            app.createList();


        } else {
            app.updateStorage();
            app.createList();
        }


        //FIRST PAGE

        app.connect(); //save token 
        app.loadPeople();

        let addPerson = document.getElementById("addButton");
        addPerson.addEventListener("click", app.inputPeople);

        // SECOND PAGE
        let savePerson = document.getElementById("savebtn");
        savePerson.addEventListener("click", app.savetoPeopleList);

        let cancelPerson = document.getElementById("cancelbtn");
        cancelPerson.addEventListener("click", app.switchPage);

        //THIRD PAGE
        let back = document.getElementById("backbtn");
        back.addEventListener("click", app.switchPage);

        let addGift = document.getElementById("addgift");
        addGift.addEventListener("click", app.inputGift);


        // FOURTH PAGE

        let saveGift = document.getElementById("savegift");
        saveGift.addEventListener("click", app.savetoGiftList);

        let cancelGift = document.getElementById("cancelgift");
        cancelGift.addEventListener("click", app.switchToDetailPage);


    },




    //LocalStorage
    //retrieve an object from local storage 
    updatePeople: function () {
        app.people = JSON.parse(localStorage.getItem(app.KEY));
    },

    //CONNECTING TO API

    connect: (resolve) => {

        let requestURL = baseURL + "registerUser.php";
        app.deviceId = "1234567890abcd";
        var data = {
            device_id: app.deviceId
        };


        let req = new Request(requestURL, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(data)
        });
        fetch(req)
            .then(response => response.json())
            .then(data => {
                if (data.code == 200) {
                    app.token = data.data.user_token;
                    app.user_id = data.data.user_id;
                    sessionStorage.setItem(app.KEY + "_token", app.token);
                    sessionStorage.setItem(app.KEY + "_user", app.user_id);
                    //save token to sessionstorage

                    resolve(app.token);
                } else {
                    console.log("error: " + data.code + " " + data.message)
                }
            })
            .catch(err => {
                console.log(err);
            });

    },


    //getting users
    loadPeople: () => {
        //people/?token=

        let requestURL = baseURL + "getPeople.php";
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");
        myHeaders.append("giftr-token", app.token);
        var options = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default'
        };

        var req = new Request(requestURL, options);

        //        app.token;
        fetch(req)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw Error('Bad HTTP!');
                }
            })
            .then(data => {
                if (data.code == 200) {
                    //check if array has items
                    if (app.people.length == 0) app.people = data.data;
                    else app.people = app.people.concat(data.data);
                    sessionStorage.setItem(app.KEY + "_people", app.people);
                    //save token to sessionstorage
                    //                    


                } else {
                    console.log(data.code + " " + data.message)

                }

            })
            .catch(err => {
                console.log(err);
            })
    },



    //ADDPERSON BUTTON 

    inputPeople: function () {
        app.personid = '';
        document.getElementById("peopleList").classList.remove("active");
        document.getElementById("addPerson").classList.add("active");


    },
    //SAVEPERSON BUTTON
    savetoPeopleList: function () {
        
        let name = document.getElementById("nm").value;
        let dob = document.getElementById("dob").value;
        
        if(app.personid != ''){ //EDITING
            console.log(app.people);
            console.log(app.personid);
            
            let target = app.people.find(person => {if (person.id == app.personid) return person});
            console.log(target);
            
            target.name = name;
            target.dob = dob;
            
            console.log(app.people);
            app.switchPage();
            //app.people = app.people.concat(person);
            
        } else {
            
        
        
            //ADDING
            



            var formdata = new FormData();
            formdata.append('dob', dob);
            formdata.append('person_name', name);
            formdata.append('user_id', app.user_id);
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "text/plain");
            myHeaders.append("giftr-token", app.token);

            let requestURL = baseURL + "postPerson.php";
            var req = new Request(requestURL, {
                method: 'POST',
                mode: 'cors',
                body: formdata,
                headers: myHeaders
            });
            fetch(req)
                .then(response => response.json())
                .then(data => {
                    if (data.code == 200) {


                        //save token to sessionstorage
                        // console.log("Person saved: " + data);
                        app.changeActivePage(ev);
                        app.changeActiveButtons(ev);

                    } else {
                        //console.log("error: " + data.code + " " + data.message)

                    }

                })
                .catch(err => {
                    console.log(err);
                })





            if (name && dob) {

                let page = document.querySelector("#peopleList");
                let ul = document.querySelector(".list-view");


                let getDat = Date.now();

                app.switchPage();
                document.getElementById("nm").value = "";
                document.getElementById("dob").value = "";
                //ul.innerHTML = "";

                let person = {
                    "id": getDat,
                    "name": name,
                    "dob": dob,
                    "ideas": []

                };

                app.people = app.people.concat(person);
            }
            
        }


            //**********SORTING PEOPLE********************
            app.people.sort((p1, p2) => {
                let dob1 = new Date(p1.dob);
                let dob2 = new Date(p2.dob);

                if (dob1.getMonth() < dob2.getMonth()) {
                    return -1;
                } else if (dob1.getMonth() > dob2.getMonth()) {
                    return 1;
                } else {
                    return 0;
                }

            });


            //******DISPLAYING SAVED MESSAGE

            let addPerson = document.getElementById('mes');
            addPerson.textContent = "SAVED";
            let overlay = document.querySelector("#savedPerson");



            overlay.classList.add("active");
            setTimeout(() => {
                overlay.classList.remove("active");

            }, 500);

            app.updateStorage();
            app.createList();

        
    },



    // CARD CREATING
    createList: function () {

        /*******DISPLAYING AN EMPTY LIST MESSAGE **/

        let empty = document.getElementById('emptyPeopleList');



        empty.textContent = "You have no saved people yet"
        if (app.people.length == 0) {
            let secondOverlay = document.querySelector("#EmptyListMessage");
            secondOverlay.classList.add("active");


        } else {
            let secondOverlay = document.querySelector("#EmptyListMessage");
            secondOverlay.classList.remove("active");

            let page = document.querySelector("#peopleList");

            let ul = document.querySelector(".list-view");

            ul.innerHTML = "";
            app.people.forEach(person => {


                let li = document.createElement('li');
                li.classList.add("list-item");

                let div = document.createElement('div');
                div.classList.add('divForContainer');
                div.setAttribute('id', 'usediv');
                div.setAttribute('data-id', person.id);
                li.setAttribute("id", "s" + person.id);


                let dateDob = new Date(person.dob);
                let d = new Date();

                if (dateDob.getMonth() < d.getMonth()) {
                    div.classList.add("list-dob");
                }


                let h = document.createElement("p");
                h.setAttribute("id", person.id);
                h.addEventListener("click", app.EditPerson);

                let h1 = document.createElement("p");
                h1.setAttribute("id", "dob2");
                let btn = document.createElement("span"); // arrow button
                btn.className = "action-right icon arrow_right";
                btn.setAttribute('arrow-id', person.id);

                h.textContent = person.name;
                h1.textContent = person.dob;
                div.appendChild(btn);
                div.appendChild(h);
                div.appendChild(h1);
                li.appendChild(div);
                ul.appendChild(li);


                //ARROW BUTTON ON EACH CARD
                btn.addEventListener('click', app.reviewDetail);

            });

           
        }

    },

    EditPerson: function (ev) {
        console.log( ev.currentTarget);
        app.personid= ev.currentTarget.id;
        
       let addPerson = document.getElementById("addPerson");
       addPerson.classList.add("active");
        let peopleList = document.getElementById("peopleList");
        peopleList.classList.remove("active");
        console.log(addPerson, "hey");
        
        let name = document.getElementById("nm").value;
        name = ev.currentTarget.textContent;
        console.log(ev.currentTarget.id);
        console.log(app.people);
        
        
        

    },


    //ARROW BUTTON ON THE EACH CARD

    reviewDetail: function (ev) {
        document.getElementById("peopleList").classList.remove("active");
        document.getElementById("DetailsPage").classList.add("active");

        //****CLEAR THE PAGE FROM PREVIOUS CARDS on the details page
        let clearPage = document.querySelector('.list-gift');
        clearPage.innerHTML = "";



        let current = ev.currentTarget.parentNode,
            id = current.getAttribute('data-id');


        let saveGiftId = document.getElementById("savegift").setAttribute("data-id", id);
        app.createSecondList(id);



    },

    //CANCELPERSON AND BACK BUTTON
    switchPage: function () {
        let addPerson = document.getElementById("addPerson");
        let peopleList = document.getElementById("peopleList");
        let details = document.getElementById("DetailsPage");

        if (addPerson.className == "page active") {


            addPerson.classList.remove("active");
            peopleList.classList.add("active");


        } else {
            details.classList.remove("active");
            peopleList.classList.add("active");
        }


    },


    // ADDGIFT BUTTON

    inputGift: function () {

        document.getElementById("DetailsPage").classList.remove("active");
        document.getElementById("addGift").classList.add("active");
        document.getElementById("idea").value = "";
        document.getElementById("at").value = "";
        document.getElementById("cost").value = "";
        document.getElementById("url").value = "";




    },


    //SAVE TO GIFT LIST

    savetoGiftList: function (ev) {
        let current = ev.currentTarget,
            id = current.getAttribute('data-id');

        let giftname = document.getElementById("idea").value;
        let location = document.getElementById("at").value;
        let giftprice = document.getElementById("cost").value;
        let url = document.getElementById("url").value;



        if (giftname && location && giftprice && url) {

            let page = document.querySelector("#DetailsPage");
            let ul = document.querySelector(".list-gift");

            let arrayOfPerson = app.people.filter(person => person.id == id);


            let getDat = Date.now();
            let giftname = document.getElementById("idea").value;
            let location = document.getElementById("at").value;
            let giftprice = document.getElementById("cost").value;
            let url = document.getElementById("url").value;

            let index;
            let idea = {
                "giftid": getDat,
                "idea": giftname,
                "at": location,
                "cost": giftprice,
                "url": url

            };

            console.log("Shawn Test Idea: ", idea);

            app.people.forEach(person => {
                if (person.id == id) {
                    index = app.people.indexOf(person);

                }
            });
            let newArray = arrayOfPerson[0].ideas,

                length = newArray.lenght - 1;

            newArray.splice(length, 0, idea);

            arrayOfPerson[0].ideas = newArray;
            app.people.splice(index, 1, arrayOfPerson[0]);


            app.createSecondList(id);
            app.secondswitchPage();
            




            //******DISPLAYING SAVED GIFT MESSAGE

            let savedGift = document.getElementById("giftMes");
            savedGift.textContent = "SAVED";
            let overlay = document.getElementById("GiftMessage");

            overlay.classList.add("active");
            setTimeout(() => {
                overlay.classList.remove("active");
            }, 500);

            app.updateStorage();

        }
    },

    createSecondList: function (value) {

        console.log('second list');
        app.people.forEach(person => {
            console.log('person', person);
            if (person.id == value) {
                console.log('right person');
                let capsName = person.name.toUpperCase();

                document.querySelector(".personTitle").textContent = capsName + "'S GIFT IDEAS";
                if (person.ideas.length == 0) {
                    console.log('0 length');

                    document.querySelector("#DetailsPage .list-gift").innerHTML = "";

                    let thirdOverlay = document.querySelector(".thirdOverlay");

                    thirdOverlay.classList.add("active");
                    
                    document.getElementById('nogifts').style = 'display:block;';


                } else {
                    let thirdOverlay = document.querySelector(".thirdOverlay");

                    thirdOverlay.classList.remove("active");

                    let detailPage = document.getElementById("DetailsPage");

                    let ul = document.querySelector("#DetailsPage .list-gift");

                    ul.innerHTML = "";

                    document.getElementById('nogifts').style = 'display:none;';

                    let personIdeas = person.ideas;
                    console.log('personideas');
                    console.log(personIdeas);
                    personIdeas.forEach(idea => {


                        let li = document.createElement('li');
                        li.classList.add("oneGift");

                        let div = document.createElement('div');
                        div.classList.add('divForGift');
                        div.setAttribute('id', 'giftid');
                        div.setAttribute('gift-id', idea.giftid);
                        li.setAttribute("data-id", idea.giftid);



                        let h = document.createElement("p");
                        h.setAttribute("id", idea.idea);
                        h.setAttribute("id", "giftNameId");

                        let h1 = document.createElement("p");
                        h1.setAttribute("class", idea.at);
                        let p1 = document.createElement("p");
                        p1.setAttribute("class", idea.cost);
                        let p2 = document.createElement("p");
                        p2.setAttribute("class", idea.url);
                        let deleteButton = document.createElement("p");
                        deleteButton.setAttribute("class", "icon delete");
                        deleteButton.setAttribute("data-id", idea.giftid);

                        deleteButton.setAttribute("person-id", person.id);

                        deleteButton.addEventListener("click", app.deleteGift);
                        let nameCaps = idea.idea.toUpperCase();



                        h.textContent = nameCaps;
                        h1.textContent = "location:" + " " + idea.at;
                        p1.textContent = "price:" + " " + idea.cost;
                        p2.textContent = "website :" + " " + idea.url;


                        let leftside = document.createElement('div');
                        leftside.className = 'giftleft';
                        let rightside = document.createElement('div');
                        rightside.className = 'giftright';

                        leftside.appendChild(h);
                        leftside.appendChild(h1);
                        leftside.appendChild(p1);
                        leftside.appendChild(p2);

                        rightside.appendChild(deleteButton);

                        div.appendChild(leftside);
                        div.appendChild(rightside);

                        li.appendChild(div);
                        ul.appendChild(li);



                    });

                    detailPage.appendChild(ul);
                }

            }

        });


    },

    deleteGift: function (ev) {
        let currentGift = ev.currentTarget;


        let currentGiftId = currentGift.getAttribute("person-id");
        console.log("Gift ID: ", currentGiftId);
        let index;
        let giftId = ev.currentTarget.getAttribute("data-id");
        console.log('giftid', giftId);



        let ideas;
        app.people.forEach(person => {
            if (person.id == currentGiftId) {
                console.log(person.id);
                let p = person;
                ideas = p.ideas;
                console.log("ideas");
                console.log(ideas);


                index = app.people.indexOf(person);
                console.log(index);
                console.log(app.people);

                //******************************//


                let deleteIdea = ideas.filter(item => item.giftid != giftId);
                // console.log(item, "this is item"); ITEM IS NOT DEFINED
                person.ideas = deleteIdea;


                app.createSecondList(person.id);



                



                //*********MESSAGE DELETED**********

                let deletedGift = document.getElementById("deleteGiftMes");
                deletedGift.textContent = "DELETED";
                let overlay = document.getElementById("DeleteGiftMessage");

                overlay.classList.add("active");
                setTimeout(() => {
                    overlay.classList.remove("active");
                }, 500);
                //            
            }
        });
                    
    },


    //save the gift button
    secondswitchPage: function () {

        let details = document.getElementById("DetailsPage");
        let addGift = document.getElementById("addGift");

        if (addGift.className == "page active") {


            addGift.classList.remove("active");
            details.classList.add("active");

        }
    },



    //CANCELGIFT BUTTON
    switchToDetailPage: function () {

        let addGift = document.getElementById("addGift");
        let details = document.getElementById("DetailsPage");

        if (addGift.className == "page active") {
            addGift.classList.remove("active");
            details.classList.add("active");
        }
    },




    //UPDATE LOCALSTORAGE
   
    updateStorage: function () {
        let str = JSON.stringify(app.people);

        localStorage.setItem(app.KEY, str);
    },


    
};









let loadEvent = ('deviceready' in document) ? 'deviceready' : 'DOMContentLoaded';
document.addEventListener(loadEvent, app.init);
