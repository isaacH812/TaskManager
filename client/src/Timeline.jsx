import { useState, useEffect } from 'react';
import { Chart } from "react-google-charts";

function Timeline() {

  const [tasks, setTasks] = useState([]);

  function getDFormant(date){
    const a = new Date(date);
    return new Date(a.getFullYear(), a.getMonth(), a.getDate());
  }

  
  
  async function getTasks(sortMethod) {
    const res = await fetch("/Tasks/", {
      method: "GET",
      credentials: "same-origin",
    });

    if (res.ok) {
      const body = await res.json();
      
      const sortedTasks = [...body.tasks].sort(sortMethod);
      console.log(sortedTasks);
      setTasks(sortedTasks); 
     
    } else {
      console.log("Error: Tasks not received");
    }
  }

  
  useEffect(() => {
  
    getTasks((a, b) => new Date(a.start_time) - new Date(b.start_time));
  }, []);

 
  
  const data = [
    [ 'Name', 'Start', 'End'],
    ...tasks.map((task) => (
      [
      task.title,
      getDFormant(task.start_time),
      getDFormant(task.end_time),
    ]
  )),
  ];

 
  const options = {
    timeline: { showRowLabels: true },
    avoidOverlappingGridLines: false,
  };

  return (
    <div>
      <h1>Timeline</h1>
      {tasks.length !== 0 ?
      <Chart
        chartType="Timeline"
        width="100%"
        height="400px"
        data={data}
        options={options}
      />
        : <h3>No Tasks Yet!</h3>}
    </div>
  );
}

export default Timeline;
