const express = require ('express');//Load the express module
const app = express();//Create an express object, a web application is created
const fs = require('fs');//Here to read JSON file later asynchronously
const path = require('path');
const expressSanitizer = require('express-sanitizer');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Passport Config
require('./config/passport')(passport);

//DB Config
const db = require('./config/keys').MongoURI;

//User Model
const User = require('./models/User');

//Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));//We make a place for the server to start listening on a port

//Homepage 
app.get('/', (req, res) => {
    res.sendFile(process.cwd()+"/indexApp/dist/indexApp/index.html");
});


//We need to add the JSON file that we will parse through
const timeTable = require('./Lab3-timetable-data.json');

//Express Session
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true}))

//Take the body from the form and parse it out so we can use the form information 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressSanitizer());

const auth = () => {
    return (req, res, next) => {
        passport.authenticate('local', (error, user, info) => {
            if(user == false && info.message == "That email is not registered in the database")
            {
                res.status(200).send(JSON.stringify({"success": false, msg: info.message }));
            }
            if(user == false && info.message == "Password Incorrect")
            {
                res.status(200).send(JSON.stringify({ success: false, msg: info.message }));
            }
            if(user == false && info.message == "The account has been de-activated. Please contact the administrator")
            {
                res.status(200).send(JSON.stringify({ success: false, msg: info.message }));
            }
            req.login(user, function(error) {
                if (error) return next(error);
                next();
            });
        })(req, res, next)
    }
}

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

const isLoggedIn = (req, res, next)  => {
    if(req.isAuthenticated())
    {
        return next()
    }
    return res.status(400).json({"statusCode": 400, "message": " not authenticated"})
}



app.post('/api/user/login', auth(), (req,res) => {
    let email = req.body.email;
    res.status(200).json({'success': true, userID: email});
});

app.post('/api/user/register', (req,res) => {
    let resArray = [];
    const  { fName, email, password, password2 } = req.body;
    //Check if passwords match
    if(password !== password2)
    {
        resArray.push({success: false, msg: 'Passwords do not match'});
    }


    if(resArray.length > 0)
    {
        res.status(200).send(resArray);
    }
    else
    {
        User.findOne({ email: email})
            .then(user => {
                if(user)
                {
                    resArray.push({success: false, msg: 'The user already exists'})
                    res.status(200).send(resArray);
                }
                else
                {
                    const newUser = new User({
                        fName,
                        email,
                        password
                    });

                    console.log(newUser);
                    resArray.push({success: true, msg:'The user has been registered. Please login now.'})
                    newUser.save()
                        .then(user => {
                            res.status(200).send(resArray);
                        })
                        .catch(err => console.log(err));
                }
            });
    }
})

app.post('/api/resultList', (req,res) => {

    if(req.sanitize(req.body.subject) == undefined && req.sanitize(req.body.courseNumber) != undefined)
    {
        res.redirect(307,'/api/courses');
    }

    else if(req.sanitize(req.body.courseNumber) == undefined && req.sanitize(req.body.subject) != undefined)
    {
        res.redirect(307,'/api/subjects');
    }

    else if(req.sanitize(req.body.subject) != undefined && req.sanitize(req.body.courseNumber) != undefined)
    {
        res.redirect(307, '/api/subjects/courses');
    }

    else if (req.sanitize(req.body.courseNumber) != undefined && req.sanitize(req.body.courseComponent) == 'lec')
    {
        res.redirect(307,'/api/subjects/courses/lec');
    }

});


//Will return all subject codes along with their appropriate classname  and descriptions
app.post('/api/subjects', (req,res) => {
    let listSubject = [];
    let testListSubject = [];

    for (let i = 0; i < timeTable.length; i++)
    {
        let obj = timeTable[i];
        if (obj.subject == req.sanitize(req.body.subject.toUpperCase()))//Will need to change this to be the inputted search instead of default
        {
            tempData =
            {
                subject: obj.subject,
                className: obj.className,
                catalog_nbr: obj.catalog_nbr,
                descrip: obj.catalog_description,
                component: obj.course_info[0].ssr_component, 
            }
            listSubject.push(tempData);//This pushes the entire object from the JSON file
            testListSubject.push(obj);
        }
    }

    if(listSubject === undefined || listSubject.length == 0)
    {
        //res.render('indexError',{errorNum: 0});
        res.status(200).send(JSON.stringify("Sorry, but the course could not be found"));
    }

    else
    {
        //res.render('indexResults', {listSubject: listSubject, make: false, make2: true});
        res.status(200).send(testListSubject);
    }
});

app.post('/api/courses', (req,res) => {

    let listSubject =[];
    let testListSubject =[];

    for(let i = 0; i < timeTable.length; i++)
    {
        let obj = timeTable[i];
        if(obj.catalog_nbr.toString().includes(req.sanitize(req.body.courseNumber.toUpperCase())))
        {
            tempData =
            {
                subject: obj.subject,
                className: obj.className,
                catalog_nbr: obj.catalog_nbr,
                descrip: obj.catalog_description,
                component: obj.course_info[0].ssr_component, 
            }
            listSubject.push(tempData);//This pushes the entire object from the JSON file
            testListSubject.push(obj);
        }

    }

    if(listSubject === undefined || listSubject.length == 0)
    {
        //res.render('indexError',{errorNum: 1});
        res.status(200).send(JSON.stringify("Sorry, but the course could not be found"));
    }

    else
    {
        //res.render('indexResults', {listSubject: listSubject, make: false, make2: true});
        res.status(200).send(testListSubject);
    }
});

app.post('/api/subjects/courses', (req,res) => {

    let listSubject =[];
    let testListSubject =[];

    for(let i = 0; i < timeTable.length; i++)
    {
        let obj = timeTable[i];
        
        if(obj.subject == req.sanitize(req.body.subject.toUpperCase()))
        {
            if (obj.catalog_nbr.toString().includes(req.sanitize(req.body.courseNumber.toUpperCase()))) 
            {
                tempData =
                {
                    subject: obj.subject,
                    className: obj.className,
                    catalog_nbr: obj.catalog_nbr,
                    descrip: obj.catalog_description,
                    component: obj.course_info[0].ssr_component,
                }
                listSubject.push(tempData);//This pushes the entire object from the JSON file
                testListSubject.push(obj);
            }
        }
        
    }

    if(listSubject === undefined || listSubject.length == 0)
    {
        //res.render('indexError',{errorNum: 0});
        res.status(200).send(JSON.stringify("Sorry, but the searched course does not exist"));
    }

    else
    {
        //res.render('indexResults', {listSubject: listSubject, make: false, make2: true});
        res.status(200).send(testListSubject);
    }
    
});

app.post('/api/keyword', (req,res) => {
    let listSubject =[];

    for(let i = 0; i < timeTable.length; i++)
    {
        let obj = timeTable[i];
        if(obj.catalog_nbr.toString().includes(req.sanitize(req.body.keyword.toUpperCase())))
        {
            listSubject.push(obj);
        }
        if(obj.className.toString().includes(req.sanitize(req.body.keyword.toUpperCase())))
        {
            if(listSubject.some(course => course.className == obj.className))
            {
                continue;
            }
            else
            {
                listSubject.push(obj);
            }
        }
        if(req.sanitize(req.body.keyword.toUpperCase()).includes(obj.catalog_nbr.toString()))
        {
            if(listSubject.some(course => course.catalog_nbr == obj.catalog_nbr))
            {
                continue;
            }
            else
            {
                listSubject.push(obj);
            } 
        }
        if(req.sanitize(req.body.keyword.toUpperCase()).includes(obj.className.toString()))
        {
            if(listSubject.some(course => course.className == obj.className))
            {
                continue;
            }
            else
            {
                listSubject.push(obj);
            } 
        }
    }
    res.status(200).send(listSubject);
});

//Create a new schedule
app.post('/api/schedule/:scheduleName', (req, res) => {
    let base = require('./schedule-dataTemplate.json');
    let data = require('./schedule-data.json');

    if(req.sanitize(req.body.userID) !== undefined)
    {
        base.schedule = req.sanitize(req.body.scheduleName);
    }
    if(req.sanitize(req.body.description) !== undefined)
    {
        base.description = req.sanitize(req.body.description);
    }

    if(req.sanitize(req.body.visibility) !== undefined)
    {
        base.status = req.sanitize(req.body.visibility);
    }
    let date = new Date();
    base.lastModDate = date.toString();

    /*Need to check if the entered schedule already exists
    If it does already exist then we need to inform the user
    and not write a new schedule. 
    If it does not exist then we will create the new schedule*/
    
    let test = data.some(x => x.schedule ==req.sanitize(req.body.scheduleName));
    if(test == true)
    {
        //res.render('indexError',{errorNum: 0});
        res.status(200).send(JSON.stringify("Sorry, but the schedule name already exists"));
    }
    
    else
    {
        data.push(base);
        fs.writeFile('schedule-data.json', JSON.stringify(data, null, "\n"), (err) => {
            if (err) { console.log(err); }
    
            else 
            { //res.render('indexSuccess', {successNum: 0}); 
                res.status(200).send(JSON.stringify("The schedule was successfully created"));
            }
        });
    }
    
});

app.delete('/api/schedule/:scheduleName', (req, res) => {
    let data = require('./schedule-data.json');

    for (x in data)
    {
        let test = data.some(z => z.schedule ==req.sanitize(req.params.scheduleName));
        //If there is a schedule that does have the specified name then we will go through the JSON file and find at which index it is at
        if(test)
        {
            if (data[x].schedule == req.sanitize(req.params.scheduleName))
            {
                console.log(x);
                data.splice(x, 1);
                fs.writeFile('schedule-data.json', JSON.stringify(data, null, "\n"), (err) => {
                    if (err) { console.log(err); }
                    else { res.status(200).send(JSON.stringify("The schedule was successfully removed"));//res.render('indexSuccess', { successNum: 1 }); 
                }
                })
            }
        }
        else
        {
            res.status(200).send(JSON.stringify("Sorry, the entered schedule does not exists in the database"))
            //res.render('indexError', {errorNum: 2});
            break;
        }
        
    }
    
});

app.delete('/api/schedules', (req, res) => {
    let data = require('./schedule-data.json');
    data.splice(0,data.length);
    fs.writeFile('schedule-data.json', JSON.stringify(data, null, "\n"), (err) => {
        if (err) {console.log(err); }
        else{ res.status(200).send(JSON.stringify("All of the schedules have been deleted"));//res.render('indexSuccess', { successNum: 2}); 
    }
    });
    
});

app.get('/api/schedule/:scheduleName', (req, res) => {
    let data = require('./schedule-data.json');
    console.log(req.params);
    console.log(req.query);
    let theSchedule = req.sanitize(req.query.scheduleName);
    let theSubject = req.sanitize(req.query.subject);
    let theCourseNumber = req.sanitize(req.query.courseNumber);
    let theCourseComponent = req.sanitize(req.query.courseComponent);
    console.log(theSchedule + "\n" + theSubject + "\n" + theCourseNumber);
    if(data === undefined || data.length == 0)
    {
        res.status(200).send(JSON.stringify("Sorry, but the schedule does not exist in the database"))
    }
    else
    {
        for (x in data) 
        {
            //Check if there is a schedule with the given name
            let test = data.some(z => z.schedule == theSchedule);
            if (test) 
            {
                if (data[x].schedule == req.sanitize(theSchedule)) 
                {
                    if(theSubject != undefined)
                    {
                        if(theCourseNumber != undefined)
                        {
                            //If looking for a course in a schedule based on subject+course+courseComponent
                            if(theCourseComponent != "all")
                            {
                                let tempArray = [];
                                for( y in data[x].listOfSchedule)
                                {
                                    if ((theSubject == data[x].listOfSchedule[y].subject) && (theCourseNumber == data[x].listOfSchedule[y].catalog_nbr) && (theCourseComponent.toUpperCase() == data[x].listOfSchedule[y].component))
                                    {
                                        tempArray.push(data[x].listOfSchedule[y]);
                                    }
                                }
                                if(tempArray.length != 0 || tempArray === undefined)
                                {
                                    res.status(200).send(tempArray);
                                    break;
                                }
                                else
                                {
                                    res.status(200).send(JSON.stringify("Sorry, the entered course was not found in this schedule"));
                                    break;
                                }
                            }

                            //If looking for a course in a schedule based on subject+course
                            else
                            {
                                let tempArray = [];
                                for( y in data[x].listOfSchedule)
                                {
                                    if ((theSubject == data[x].listOfSchedule[y].subject) && (theCourseNumber == data[x].listOfSchedule[y].catalog_nbr))
                                    {
                                        tempArray.push(data[x].listOfSchedule[y]);
                                    }
                                }
                                if(tempArray.length != 0 || tempArray === undefined)
                                {
                                    res.status(200).send(tempArray);
                                    break;
                                }
                                else
                                {
                                    res.status(200).send(JSON.stringify("Sorry, the entered course was not found in this schedule"));
                                    break;
                                }
                            }
                            
                        }

                        //If searching for a specfic subject in the schedule
                        else
                        {
                            let tempArray = [];
                            for( y in data[x].listOfSchedule)
                            {
                                if (theSubject == data[x].listOfSchedule[y].subject)
                                {
                                    tempArray.push(data[x].listOfSchedule[y]);
                                }
                            }
                            if(tempArray.length != 0 || tempArray === undefined)
                            {
                                res.status(200).send(tempArray);
                                break;
                            }
                            else
                            {
                                res.status(200).send(JSON.stringify("Sorry, the entered subject was not found in this schedule"));
                                break;
                            }
                        }

                    }
                    
                    //If searching for just the schedule
                    else
                    {
                        res.status(200).send(data[x].listOfSchedule);
                        break;
                    }
                    
                }
            }

            //res.render('indexResults', { resultingSchedule: data[x].listOfSchedule, make: true, make2: false });


            //If there is no schedule with the entered name then we state to the user that it does not exist
            else 
            {
                //res.render('indexError', { errorNum: 2 });
                res.status(200).send(JSON.stringify("Sorry, the schedule does not exist in the database"));
                break;
            }
        }
    }
    
    
});

app.get('/api/schedules', (req,res) => {
    let data = require('./schedule-data.json');
    let listSubject =[];

    for(x in data)
    {
        
    }
});

app.post('/api/schedule/:schedulename/:scheduleForm', (req, res) => {
    //Need to use the Lab3-timetable-json, timeTable and add it to the 
    //Need to match the chosen radio button using the class description and the class type to find it in the timeTable
    //console.log(req.query);//Nothing in here

    let data = require('./schedule-data.json');
    let listSubject =[];

    for(let i = 0; i < timeTable.length; i++)
    {
        let obj = timeTable[i];
        
        if(obj.subject == req.sanitize(req.body.subject.toUpperCase()))
        {
            if (obj.catalog_nbr.toString().includes(req.sanitize(req.body.courseNumber.toUpperCase()))) 
            {
                if(obj.course_info[0].ssr_component == req.sanitize(req.body.courseComponent.toUpperCase()))
                {
                    tempData =
                    {
                        subject: obj.subject,
                        className: obj.className,
                        catalog_nbr: obj.catalog_nbr,
                        descrip: obj.catalog_description,
                        component: obj.course_info[0].ssr_component,
                    }
                    listSubject.push(tempData);//This pushes the entire object from the JSON file
                }
            }
        }
        
    }

    if(listSubject === undefined || listSubject.length == 0)
    {
        //res.render('indexError',{errorNum: 3});
        res.status(200).send(JSON.stringify("Sorry, but the course could not be added to the schedule"));
    }

    for(x in data)
    {
        //Check if there is a schedule with the given name
        let test = data.some(z => z.schedule == req.sanitize(req.body.scheduleName));
        if (test) 
        {
            if (data[x].schedule == req.sanitize(req.body.scheduleName))
            {
                if((data[x].listOfSchedule).length > 0)
                {
                    (data[x].listOfSchedule).push(listSubject[0]);
                }
    
                else
                {
                    data[x].listOfSchedule = listSubject;
                }
    
                fs.writeFile('schedule-data.json', JSON.stringify(data, null, "\n"), (err) => {
                    if (err) {console.log(err); }
                    else{
                         //res.render('indexSuccess',{successNum: 3}); 
                         res.status(200).send(JSON.stringify("The course was succesfully added to the schedule"));
                        }
                })
                break;
            }
           
        }

        //If there is no schedule with the entered name then we state to the user that it does not exist
        else 
        {
            //res.render('indexError', { errorNum: 2 });
            res.status(200).send(JSON.stringify("Sorry, the schedule does not exist in the database"));
            break;
        }
    }
});