// Used for rendering the app state, and for handling minor component
// local state.
import React, { useState, useReducer } from "react"
import ReactDOM from "react-dom"

// The app state is immutable, we'll use partial.lenses to update
// selected parts of it, in order to return new app state.
import * as L from "partial.lenses"

// We'll use UUIDv4 as task identifiers; this allows the frontend to
// detect if it already has the task it received from the backend.
import uuid from "uuid/v4"

const freezeDeep = obj => {
  for (let name of Object.getOwnPropertyNames(obj)) {
    let value = obj[name]
    if (value && typeof value === "object") {
      obj[name] = freezeDeep(value)
    }
  }

  return Object.freeze(obj)
}

const startState = freezeDeep({
  lastEvent: null,
  model: {
    taskFilterText: "",
    tasks: Object.fromEntries(
      [
        "Buy milk",
        "Change winter tires",
        "Plough snow",
        "Go watch starry night sky",
        "Think about life and death"
      ].map(name => [uuid(), { isDone: false, name }])
    )
  }
})

const stateReducer = (() => {
  const taskL = id => ["tasks", id]

  const updateModel = (action, m) => {
    switch (action.type) {
      case "filterTasksBy":
        return L.set(["taskFilterText"], action.text.trim().toLowerCase(), m)
      case "markTaskDone":
        return L.set([taskL(action.id), "isDone"], action.isDone, m)
      case "deleteTask":
        return L.remove(taskL(action.id), m)
      case "addTask":
        return L.assign("tasks", { [uuid()]: { isDone: false, name: action.name } }, m)
      default:
        throw new Error("unknown action type: " + action.type)
    }
  }

  return (state, action) => {
    const s1 = L.set("lastEvent", action, state)
    const s2 = L.modify("model", updateModel.bind(undefined, action), s1)
    console.log("reduced state:", s2) // debugging only
    return s2
  }
})()

const SearchTaskField = ({ value, filterTasksBy }) => {
  const [text, setText] = useState(value)

  const onChange = e => {
    const str = e.target.value
    // Utilize React's useState to save input text as is, and...
    setText(str)
    // filter the tasks with the normalized version of the input text.
    filterTasksBy(str)
  }

  return <input type="text" value={text} onChange={onChange} placeholder="Search tasks" />
}

const Task = ({ name, id, isDone, markTaskDone, deleteTask }) => {
  const onChange = markTaskDone.bind(undefined, id, !isDone)

  const onClick = deleteTask.bind(undefined, id)

  return (
    <span>
      <span>{name}</span>
      <input type="checkbox" checked={isDone} onChange={onChange} />
      <button onClick={onClick}>Delete</button>
    </span>
  )
}

const TaskList = ({ tasks, deleteTask, markTaskDone }) => (
  <ul>
    {tasks.map(([id, { name, isDone }]) => (
      <li key={id}>
        <Task id={id} name={name} isDone={isDone} deleteTask={deleteTask} markTaskDone={markTaskDone} />
      </li>
    ))}
  </ul>
)

const AddTaskField = ({ addTask }) => {
  const [text, setText] = useState("")

  const onChange = e => setText(e.target.value)

  const onKeyDown = e => {
    if (e.key === "Enter") {
      onAdd()
    }
  }

  const onAdd = () => {
    addTask(text)
    setText("")
  }

  return (
    <div>
      <input type="text" value={text} onChange={onChange} onKeyDown={onKeyDown} placeholder="Add task" />
      <button onClick={onAdd}>Add</button>
    </div>
  )
}

const App = ({ startState, stateReducer }) => {
  const [state, dispatch] = useReducer(stateReducer, startState)

  const filterTasksBy = text => {
    dispatch({ type: "filterTasksBy", text })
  }

  const markTaskDone = (id, isDone) => {
    dispatch({ type: "markTaskDone", id, isDone })
  }

  const deleteTask = id => {
    dispatch({ type: "deleteTask", id })
  }

  const addTask = name => {
    dispatch({ type: "addTask", name })
  }

  const filteredTasks = Object.entries(state.model.tasks).filter(([_, t]) =>
    t.name.toLowerCase().includes(state.model.taskFilterText)
  )

  console.log("render state:", state) // debugging only

  return (
    <div className="app">
      <SearchTaskField filterTasksBy={filterTasksBy} value={state.model.taskFilterText} />
      <div>Found {filteredTasks.length} tasks</div>
      <TaskList tasks={filteredTasks} deleteTask={deleteTask} markTaskDone={markTaskDone} />
      <AddTaskField addTask={addTask} />
    </div>
  )
}

const rootEl = document.getElementById("root")
ReactDOM.render(<App startState={startState} stateReducer={stateReducer} />, rootEl)
