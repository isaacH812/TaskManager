import { useState, useEffect } from 'react'
import { useNavigate} from "react-router-dom"
import * as cookie from "cookie";



function Settings() {
  const navigate = useNavigate();
 
  const[barFilter, setbar] = useState("");
  const[includeBar, setincludeB] = useState(true);
  const[includeGraph, setincludeG] = useState(true);
  const[taskFilter, settask] = useState("");
  const[taskColor, setColor] = useState(false);

  useEffect(() => {
    getSettings();
  }, []);


  async function saveSettings() {
    const res = await fetch("/settings/",{
           method: "post",
           credentials: "same-origin",
           body: JSON.stringify({
            includeBar,
            barFilter,
            includeGraph,
            taskFilter,
            taskColor
           }),
           headers:{
            "Content-Type": "application/json",
            "X-CSRFToken": cookie.parse(document.cookie).csrftoken
           } 
        })
    }

    async function getSettings() {
      const res = await fetch("/settings/", {
        method: "GET",
        credentials: "same-origin",
      });
      if (res.ok) {
        const body = await res.json();
        console.log(body.settings);
        setbar(body.settings.bar_filter)
        setincludeB(body.settings.bar)
        setColor(body.settings.task_color)
        setincludeG(body.settings.graphic)
        settask(body.settings.task_filter)
      }else{
        console.log("settings error: not received")
      }
    }



  return (
   <div>
    <form onSubmit={saveSettings}>
    <div>
      <h3>Side Bar</h3>
      Include Chart:<input type="checkbox"  onChange={()=>{setincludeG(!includeGraph)}} checked={includeGraph}/>
      Display: 
      <select  id="bar-filter" onChange={(e)=>{setbar(e.target.value);}} value={barFilter}>
        <option value="1">Upcoming Due Dates</option>
        <option value="2">Past Due Dates</option>
        <option value="3">Upcoming Start Dates</option>
        <option value="4">Past Start Date</option>
      </select>
    </div>
    <div>
      <h3>Tasks</h3>
      Include Task Color:<input type="checkbox" onChange={()=>{setColor(!taskColor)}} checked={taskColor} />
      Filter: <select  id="task-filter" onChange={(e)=>{settask(e.target.value)}} value={taskFilter}>
        <option value="1">Due Date</option>
        <option value="2">Start Date</option>
        <option value="3">Most Complete</option>
        <option value="4">Least Complete</option>
      </select>
    </div>
      <button>Apply</button>
    </form>
   </div> 
  )
}

export default Settings;
