import {useState, useEffect} from 'react';
import axios from 'axios';



function UserPage () {

    //Value to disable or enable time fields
    const [disableTime, setDisableTime] = useState(false);
    const [description, setDescription] = useState("");
    const [startTime, setStartTime] = useState(1);    
    const [startTimeMinutes, setStartTimeMinutes] = useState(0);
    const [endTime, setEndTime] = useState(1);
    const [endTimeMinutes, setEndTimeMinutes] = useState(15);
    const [user, setUser] = useState(false)
    const [tasks, setTasks] = useState(false)
    const [AMorPM, setAMorPM] = useState("AM");
    const [endAMorPM, setENDAMorPM] = useState("AM");        
    const [days, setDays] = useState(new Date());    
    const [daysToFilter, setDaysToFilter] = useState(1);

    //DEV STATE
    const [startTimeDev, setStartTimeDev] = useState("");
    const [endTimeDev, setEndTimeDev] = useState("");
    const [descriptionDev, setDescriptionDev] = useState("");

    //function to fetch tasks and set the state
    const fetchTasks = () => {
        axios.get("/api/tasks", { headers : {
            "Authorization" : `Bearer ${window.localStorage.getItem('token')}`
        }}).then(tasks => {
            setTasks(tasks)
        })
    }

    useEffect(() => {
        axios.get("/api/users/me", { headers : {
                "Authorization" : `Bearer ${window.localStorage.getItem('token')}`
            }}).then(currentUser => {
                setUser(currentUser)
            })                        
        fetchTasks();                    
    }, [])

    const formattedDate = (hour, minutes, myDay=1) => {
        
        const today = new Date();

        const fullYear = today.getFullYear();
        const month = today.getMonth();
        const day = today.getDay()+1;

        

        return new Date(fullYear, month, day, hour, minutes);
        
    }

    const createTask = async (dev) => {

        
        
        let startTimeHour = startTime;          
        let endTimeHour = endTime;
        let startTimeMin = startTimeMinutes;
        let endTimeMin = endTimeMinutes;
        let amOrPm = AMorPM;
        let endAmOrPm = endAMorPM;
        let myDescription = description;
        let myDays = days;

        if(dev === "dev"){
            const [startTimeHr, startTimeMins] = startTimeDev.slice(0, -2).split(":");
            const [endTimeHr, endTimeMins] = endTimeDev.slice(0, -2).split(":");
            
            startTimeHour = startTimeHr;
            endTimeHour = endTimeHr;
            startTimeMin = startTimeMins;
            endTimeMin = endTimeMins;
            amOrPm = startTimeDev.slice(startTimeDev.length - 2, startTimeDev.length);
            endAmOrPm = endTimeDev.slice(endTimeDev.length - 2, endTimeDev.length);
            myDescription = descriptionDev;

        }
        
        
        // console.log(startTimeMinutes, endTimeMinutes);

        if(disableTime){
            await axios.post("/api/tasks", { description : myDescription }, { headers : {
                "Authorization" : `Bearer ${window.localStorage.getItem('token')}`
            }});   
        } else {
        //console.log(fullYear, month, day, startTimeHour = AMorPM === "PM" ? ((startTime*1) + 12).toString() : startTimeHour, startTimeMinutes);        
        const startTimeDate = formattedDate(startTimeHour = amOrPm === "PM" ? ((startTimeHour*1) + 12).toString() : startTimeHour, startTimeMin, myDays);
        //console.log(startTimeDate);
        const endTimeDate = formattedDate(endTimeHour = endAmOrPm === "PM" ? ((endTimeHour*1) + 12).toString() : endTimeHour, endTimeMin, myDays)

        await axios.post("/api/tasks", { description : myDescription, startTime : startTimeDate, endTime : endTimeDate, amOrPm, endAmOrPm }, { headers : {
            "Authorization" : `Bearer ${window.localStorage.getItem('token')}`
        }});

        }

        
        fetchTasks();
        // dev === "dev" ? setDescriptionDev("") : setDescription("")
        if(dev === "dev"){
            setDescriptionDev("");
            setStartTimeDev("");
            setEndTimeDev("");
        } else {
            setDescription("");
        }
                
        
                        
    }

    const deleteTask = async (taskId) => {
        await axios.delete(`/api/tasks/${taskId}`, { headers : {
            "Authorization" : `Bearer ${window.localStorage.getItem('token')}`
        }});
        
        fetchTasks();

    }

    //convert database task into proper format
    const convertDate = (date, amOrPm) => {        
        const newDate = new Date(date);
        let hours = newDate.getHours();
        let minutes = newDate.getMinutes();

        if(minutes === 0){
            minutes = `00`;
        }
        // console.log("convertDate", hours, minutes);
        if(hours > 12){
            hours -= 12;
        }
            return `${hours}:${minutes}${amOrPm}`
        
        
        
    }

    const buttonValidator = () => {
        let fullStartTime = ((startTime*1) * 60) + (startTimeMinutes*1);
        let fullEndTime = ((endTime*1) * 60) + (endTimeMinutes*1);
        
        //if its PM, add total minutes, 12 hours * 60 minutes = 720 minutes
        if(AMorPM === "PM"){
            fullStartTime += 720;
        }
        if(endAMorPM === "PM"){
            fullEndTime += 720;
        }

        return fullStartTime >= fullEndTime
    }

    const pickStartTime = (e) => {
        setStartTime(e.target.value);
    }
    const pickEndTime = (e) => {
        setEndTime(e.target.value);
    }
    const pickStartTimeMinutes = (e) => {
        setStartTimeMinutes(e.target.value);
    }
    const pickEndTimeMinutes = (e) => {
        setEndTimeMinutes(e.target.value);
    }
    const pickAMorPM = (e) => {
        setAMorPM(e.target.value);
    }
    const pickAMorPMEND = (e) => {
        setENDAMorPM(e.target.value);
    }

    const enterTask = (e) => {        
        setDescription(e.target.value);        
    }

    //DEV FUNCTIONS
    const enterTaskDev = (e) => {
        setDescriptionDev(e.target.value);
    }
    const handleEndTimeDev = (e) => {
        setEndTimeDev(e.target.value)
    }
    const handleStartTimeDev = (e) => {
        setStartTimeDev(e.target.value)
    }


    const getMonthAndDay = () => {
        const today = new Date();
        //set day to NEXT day incase we are on the last day of the month.                
        return `${today.toLocaleString('default', { month: 'short' })} ${today.getDate()}`
    }

    const getMonthAndDay2 = () => {
        const currentDay = new Date();
        //set day to NEXT day incase we are on the last day of the month.
        const month = currentDay.toLocaleString('default', { month: 'short' })

        const nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + days.getDate());
                

        return `${month} ${currentDay.getDate()}`
    }

    const getCorrectDay = () => {
        
        const today = new Date();
        today.setDate((daysToFilter*1)+days.getDate());

        //setDaysToFilter(today.setDate(today.getDate() + (daysToFilter*1)));
        return today;
    }
    
    //This will sort our tasks Array for us using their starting time in milliseconds
    let sortedTasks = tasks.data ? tasks.data.sort((a, b) => {
        const millisecondsA = new Date(a.startTime).getTime();
        const millisecondsB = new Date(b.startTime).getTime();

        return millisecondsA - millisecondsB
    }) : [];
    



    //console.log(user);
    //console.log(tasks);
    // console.log(startTime);
    // console.log(startTimeMinutes);
    // console.log(AMorPM);
    //console.log(startTimeDev);
    

    return (
        <div>
            Hey <strong>{user.data ? user.data.name : "guest"}!<span> It is {getMonthAndDay()}</span></strong> 
            <br />
            <p> see tasks for the next <input value={daysToFilter} onChange={(e) => setDaysToFilter(e.target.value)} type="number" style={{ fontSize:"20px", textAlign:"center", width: "35px", height:"25px"}} /> days </p>                       
            <h2> Your Tasks from {getMonthAndDay2()} {daysToFilter > 0 ? `to ${getCorrectDay().toLocaleString('default', { month: 'short' })} ${getCorrectDay().getDate()}` : "" }</h2>                        
            <p> Select date for task <input type="text" style={{ marginRight:"20px", width: "50px", height:"30px"}} /> </p>
            {tasks.data ? tasks.data.map(task => {
                return <div key={task._id}>
                {task.startTime && task.endTime ?
                    <strong> {convertDate(task.startTime, task.amOrPm)} - {convertDate(task.endTime, task.endAmOrPm)} </strong>
                    :
                    null }
                <li style={{ color: Date.parse(task.startTime) - Date.now() < 21600000 ? "red" : "", marginBottom:"15px" }}>{task.description}
                <button style={{marginLeft:"10px"}} onClick={() => deleteTask(task._id)}> x </button>
                <br />                
                </li> 
                </div>                               
            }) : null}
            <h4> Description </h4>
            <textarea style={{ height:`${20+description.length}px`, width:"150px"}} value={description} onChange={enterTask} />

            {/* <h4> Start time </h4>
            <input type="text" name="startTime" value={startTime} onChange={enterTask} /> */}            
            <h3> Time </h3>
            <button onClick={() => setDisableTime(!disableTime)} style={{ backgroundColor: disableTime ? "limegreen" : "crimson", marginLeft:"10px", fontWeight:"bold" }}> { disableTime ? "select time" : "omit time" } </button>
            {disableTime ? "" : <div>             
            <label>                
          Pick your start time 
          <select disabled={disableTime} style={{ marginLeft:"5px", marginTop:"10px" }} value={startTime} onChange={pickStartTime}>            
            {Array.from(Array(12).keys()).map(hour => {
                return (
                    <option key={hour} value={hour+1}> {hour+1} </option>
                )
            })}
          </select>
          <select disabled={disableTime} value={startTimeMinutes} onChange={pickStartTimeMinutes}>
                <option value={0}> 00 </option>            
            {Array.from(Array(3).keys()).map(minutes => {
                return (
                    <option key={minutes} value={(minutes+1)*15}> {(minutes+1) * 15} </option>
                )
            })}                    
          </select>
        </label>
        <select disabled={disableTime} value={AMorPM} onChange={pickAMorPM}>
            <option  value="AM"> AM </option>
            <option  value="PM"> PM </option>
        </select>                
        <label>
                <br />
          Pick your end time 
          <select disabled={disableTime} style={{ marginLeft:"9px", marginTop:"10px" }} value={endTime} onChange={pickEndTime}>            
            {Array.from(Array(12).keys()).map(hour => {
                return (
                    <option key={hour} value={hour+1}> {hour+1} </option>
                )
            })}
          </select>
          <select disabled={disableTime} value={endTimeMinutes} onChange={pickEndTimeMinutes}>
          <option value={0}> 00 </option>            
            {Array.from(Array(3).keys()).map(minutes => {
                return (
                    <option key={minutes} value={(minutes+1)*15}> {(minutes+1) * 15} </option>
                )
            })}            
          </select>
        </label>
        <select disabled={disableTime} value={endAMorPM} onChange={pickAMorPMEND}>
            <option  value="AM"> AM </option>
            <option  value="PM"> PM </option>
        </select>        
        </div> }
        <br />
        <br />
        { buttonValidator() ? <p style={{ color: "red" }}> PLEASE SELECT AN APPROPRIATE TIMING! </p> : null}
            <button disabled={buttonValidator()} style={{ marginTop:"10px"}} onClick={createTask}> Create task </button>            
            
        <h2> Create task as Dev </h2>
        <h4> Description </h4>        
        <textarea style={{ height:`${20+descriptionDev.length}px`, width:"150px"}} value={descriptionDev} onChange={enterTaskDev} />
        <br />
        <p>Enter your start time and end time in proper format. (example: 1:15AM to 1:30AM)</p>
        <input value={startTimeDev} onChange={handleStartTimeDev} type="text" style={{ marginRight:"20px", width: "50px", height:"30px"}} />
        to
        <input value={endTimeDev} onChange={handleEndTimeDev} type="text" style={{ marginLeft:"20px", width: "50px", height:"30px"}} />                    
        <br/>
        <button style={{ marginTop:"10px"}} onClick={() => createTask("dev")}> Create task dev </button>


        </div>
    )
}

export default UserPage