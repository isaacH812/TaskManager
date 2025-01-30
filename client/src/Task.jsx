import { useEffect, useState } from 'react';
import * as cookie from "cookie";

import './Task.css'

function Home() {
  const [tasks, setTasks] = useState([]);
  const [btasks, setBTasks] = useState([]);
  const [colorMode, setCMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [barTitle, setbTitle] = useState('');
  const today = new Date();
  console.log(tasks)

  async function getTasks(sortMethod, bf) {
    const res = await fetch("/Tasks/", {
      method: "GET",
      credentials: "same-origin",
    });

    if (res.ok) {
      const body = await res.json();
      const sortedTasks = [...body.tasks]
        .sort(sortMethod) // Sorts the tasks by settings stuff
        .filter(task => task.completed === false); 
      setTasks(sortedTasks);
      setLoading(false);
      makeBar(bf, sortedTasks);
    } else {
      setLoading(false);
      console.log("Error: Tasks not received");
    }
  }

  async function getSettings() {
    const res = await fetch("/settings/", {
      method: "GET",
      credentials: "same-origin",
    });
    if (res.ok) {
      const body = await res.json();
      makeDisplay(body.settings);
    } else {
      console.log("Error: Settings not received");
    }
  }

  useEffect(() => {
    getSettings();
  }, []);

  function makeDisplay(settings){
    
    const byDue = (a, b) => new Date(a.end_time) - new Date(b.end_time);
    const byStart= (a, b) => new Date(a.start_time) - new Date(b.start_time);
    const byMCom= (a, b) => (b.sub_done.filter(t=>(t === true))).length - (a.sub_done.filter(t=>(t === true))).length;
    const byLCom= (a, b) => (a.sub_done.filter(t=>(t === true))).length - (b.sub_done.filter(t=>(t === true))).length;
    const tSorts ={"1": byDue, "2": byStart, "3":byMCom, "4":byLCom}; 

    const sortMethod = tSorts[settings.task_filter]
    setCMode(settings.task_color)
    getTasks(sortMethod, settings.bar_filter);
    
  }

  function makeBar(bf, t){
    const dueSoon = (a =>( new Date(a.end_time) - today < 432000000));
    const late = (a =>( new Date(a.end_time) < today));
    const StartSoon = (a =>( new Date(a.start_time) - today < 432000000));
    const lateStart = (a => (new Date(a.start_time) < today));

    const bSorts = {"1": dueSoon, "2": late, "3": StartSoon, "4": lateStart};
    const btitle = {"1": "Due Soon:", "2": "Past Due", "3": "Start Soon:", "4": "Started:"};
    const sortMethod = bSorts[bf];
    const title = btitle[bf];
    
    const barTasks = t.filter(sortMethod);
    console.log(barTasks);
    setbTitle(title);
    setBTasks(barTasks);
  }

  
  async function saveCheck(index, id) {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        const updatedSubDone = [...task.sub_done];
        updatedSubDone[index] = !updatedSubDone[index]; 
        return { ...task, sub_done: updatedSubDone };
      }
      return task;
    });

    setTasks(updatedTasks); 

    const res = await fetch("/check/", {
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify({ index, id }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookie.parse(document.cookie).csrftoken,
      },
    });

    if (!res.ok) {
      console.error("Failed to save the checkbox state to the backend");
      
    }
  }

  async function remove(id) {
    const res = await fetch("/remove/", {
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookie.parse(document.cookie).csrftoken,
      },
    });
    getSettings(); //reloads the page pretty much
  }


  return (
    <>
    <div className='bar'>
              <h1>{barTitle}</h1>
              <div className='bar-tasks'>
                {btasks.length === 0 || loading?(
                  <p>No Tasks Match Filter</p>
                ):( 
                  
                  btasks.map(task=>(
                    <span id='bar-task'>
                      <b>Task:</b> {task.title}
                    </span>
                  ))
                )}
              </div>
        </div>
     
        <div className='tasks-container'>
          {loading ? (
            <p>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p>No tasks available</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className={`task ${ new Date(task.end_time) <= today && colorMode ? "late": "" } ${ new Date(task.start_time) <= today && colorMode ? "start": "" }`}>
                <span id='mainT'>
                  <h3>{task.title}</h3>
                  <div>Start: {new Date(task.start_time).toDateString()}</div>
                  <span>Due: {new Date(task.end_time).toDateString()}</span>
                </span>
                <span id="noteT">
                  Notes:
                  <div>{task.body}</div>
                </span>
                <span id='subT'>
                  {task.sub_tasks.map((sub, index) => (
                    <span key={index + sub}>
                      <label>
                        {sub}
                        <input
                          type="checkbox"
                          onChange={() => saveCheck(index, task.id)} 
                          checked={task.sub_done[index]} 
                        />
                      </label>
                    </span>
                  ))}
                </span>
                <span>
                 
                </span>
                <span>
                  <button onClick={()=>remove(task.id)}>Complete</button>
                </span>
              </div>
            ))
          )}
        </div>
    
    </>
  );
}

export default Home;
