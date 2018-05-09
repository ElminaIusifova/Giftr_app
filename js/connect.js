//connect to API and get a token

    connect: (resolve) => {
        
        app.deviceId = "";
        let requestURL = app.baseURL + "registerUser.php";
        
        //First request checks if there is a user created before with same device_id
        console.log("Connection url: " + requestURL);
        fetch(requestURL + "?device_id=" + app.deviceId)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw Error('BAD CODE');
                }
            })

            .then(data => {
                if (data.code == 200 && data.data.length > 0) {
                    //if device_id registered before try to get token
                    app.token = data.data[0].token;
                    app.user_id = data.data[0].user_id;
                    sessionStorage.setItem(app.KEY + "_token", app.token);
                    sessionStorage.setItem(app.KEY + "_user", app.user_id);
                    //save token to sessionstorage
                    console.log("Connection Established. Token: " + app.token);
                    resolve(app.token);
                } else if (data.code == 200 && data.data.length == 0) {
                    //if user doesn't exist, create new one
                    console.log("No user found. Try to create new one")
                    let formdata = new FormData();
                    formdata.append('device_id', app.deviceId);
                    let req = new Request(requestURL, {
                        method: 'POST',
                        mode: 'cors',
                        body: formdata
                    });

                    fetch(req)
                        .then((response) => {
                            if (response.ok) {
                                return response.json();
                            } else {
                                throw Error('YOU SCREWED ');
                            }
                        })
                        .then(data => {
                            if (data.code == 0) {
                                app.token = data.data[0].token;
                                app.user_id = data.data[0].user_id;
                                sessionStorage.setItem(app.KEY + "_token", app.token);
                                sessionStorage.setItem(app.KEY + "_user", app.user_id);
                                //save token to sessionstorage
                                console.log("Connection Estabished. Token: " + app.token);
                                resolve(app.token);
                            } else {
                                console.log("error: " + data.code + " " + data.message)
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            })
            .catch(err => {
                console.log(err);
            });
        //save token

    },


    //getting users
    loadPeople: () => {
        //people/?token=

        let requestURL = app.baseURL + "getPeople.php";
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
                    console.log("Here are  your people: ");
                    console.log("Success!" app.people);


                } else {
                    console.log(data.code + " " + data.message)

                }

            })
            .catch(err => {
                console.log(err);
            })
    },


        
        
        
        savetoPeopleList: function () {
        let name = document.getElementById("nm").value;
        let dob = document.getElementById("dob").value;


        var formdata = new FormData();
        formdata.append('dob', dob);
        formdata.append('person_name', name);
        formdata.append('user_id', app.user_id); 
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "text/plain");
        myHeaders.append("giftr-token", app.token);

        let requestURL = app.baseURL + "postPerson.php";
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
                    console.log("Person saved: " + data);
                    app.changeActivePage(ev);
                    app.changeActiveButtons(ev);

                } else {
                    console.log("error: " + data.code + " " + data.message)

                }

            })
            .catch(err => {
                console.log(err);
            })


            
            
            
            
            
            
            
            
            connect: async function (resource, method, token, parameters) {
        let options = {
            "method": method,
            "mode": 'cors'
        };
        if (token) {
            options.headers = {
                "Giftr-Token": token,
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                //"Content-type": 'application/json'
            };
        }

        if (parameters) {
            
            switch(method){
                case "POST":
                    options.body = parameters;
                    break;
                case "PUT":
                    options.body = JSON.stringify(parameters);
                    break;
                default:
                    console.log("Something not right with the method");
            }

        }

        let response = await fetch(resource, options);
        let data = await response.json();
        return data;
    }
        ,    
               

            
            ALTER TABLE idea_table ADD CONSTRAINT fk_user_id
FOREIGN KEY idea_table (person_id)
REFERENCES people_table(person_id)
ON UPDATE CASCADE
