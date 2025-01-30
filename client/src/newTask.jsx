import { useState } from 'react'
import {useParams, useNavigate} from "react-router-dom"
import * as cookie from "cookie";
import './newTask.css'

function newTask() {
 
const navigate = useNavigate();

const [checkboxes, setCheckboxes] = useState([]);
const [moreoptions, setoptions] = useState(false);
const[title, setTitle] = useState("");
const[notes, setNotes] = useState("");
const[start, setStart] = useState("");
const[end, setEnd] = useState("");
const [inputValues, setInputValues] = useState(checkboxes.map(() => ""));



async function createTask(e){
    e.preventDefault();
    let input = [" "];
    if(inputValues.length>0){
        input = inputValues.filter(inp=>(inp !== "" && inp !== undefined && inp.trim() !== ""));
    }
    const checked = [...input].map(()=>(false))
  
    const res = await fetch("/Tasks/",{
       method: "post",
       credentials: "same-origin",
       body: JSON.stringify({
        title,
        notes,
        start,
        end,
        input,
        checked

       }),
       headers:{
        "Content-Type": "application/json",
        "X-CSRFToken": cookie.parse(document.cookie).csrftoken
       } 
    })
    navigate("/");
}

const handleInputChange = (index, value) => {
    // Update the specific index in the inputValues array
    const updatedValues = [...inputValues];
    updatedValues[index] = value;
    setInputValues(updatedValues);
};

  return (
   <div>
    <h1>New Task</h1>
    <form onSubmit={createTask}>
    <div className='task-info'>
        <label htmlFor="title">Title:</label>
        <input type="text" id='title' onChange={(e)=>{setTitle(e.target.value)}}/>

        <label htmlFor="notes">Notes:</label>
        <textarea id="notes" onChange={(e)=>{setNotes(e.target.value)}}></textarea>

        <label htmlFor="start">Start Date:</label>
        <input type="datetime-local" id="start" onChange={(e)=>{setStart(e.target.value)}}/>

        <label htmlFor="end">Due Date:</label>
        <input type="datetime-local"id="end" onChange={(e)=>{setEnd(e.target.value)}}/>

        <label htmlFor="graphic">Include Sub-Tasks?</label>
        <input type="checkbox" id="graphic" onChange={(e)=>{
            setoptions(!moreoptions);
        }}/>
        {moreoptions &&(
            <>
            <div className='sub-tasks'>
                {checkboxes.map((label, index) => (
                    <span>
                    <label key={index}>
                        {label}
                        <input type="text" onChange={(e)=>{handleInputChange(index,e.target.value)}}/>
                    </label>
                    </span>
                ))}
            </div>
             <button onClick={(e)=>{
                setCheckboxes([...checkboxes, `Sub ${checkboxes.length+1} Lable:`])
                e.preventDefault();
                console.log(inputValues);
            }}>Add Sub-Task</button>
             </>
        )}
    </div>
    <button>Save</button>
    </form> 
    </div>
    
  )
}

export default newTask;
