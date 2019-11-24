// Used for app state management.
import { of as rxOf, concat as rxConcat, Subject as RxSubject } from "rxjs"
import { distinctUntilChanged as rxDistinctUntilChanged, scan as rxScan, tap as rxTap } from "rxjs/operators"

// Used for rendering the app state, and for handling minor component
// local state.
import React, { useState } from "react"
import ReactDOM from "react-dom"

// The app state is immutable, we'll use partial.lenses to update
// selected parts of it, in order to return new app state.
import * as L from "partial.lenses"

// Only used to check that two consecutive app states are different.
import isEqual from "lodash.isequal"

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

// An observable of a single event, the immutable starting point of the
// app state.
const initO = rxOf(
  freezeDeep({
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
)

// A subject (a special observable that allows publishing) of
// user-initiated actions.
const actionS = new RxSubject()

// The observable of app state events. The receival of such an event
// means that the app state changed.
const stateO = rxConcat(initO, actionS).pipe(
  rxScan(({ model }, event) => Object.freeze({ model: event.updateModel(model), lastEvent: event })),
  rxDistinctUntilChanged((a, b) => isEqual(a.model, b.model)),
  rxTap(s => console.log("stateO:", s)) // debugging only
)

// The dispatch logic of user-initiated actions. The methods of the
// returned object will be passed as props to the React components.
//
// Alternatively, you could remove the controller and relocate each
// method implementation inside the appropriate React component, passing
// just the `actionS` subject to all the components. But I think that
// would make the React components to have too much responsibility.
//
// The downside of the controller approach is that it puts all action
// implementations into a single location.
const controller = (() => {
  const taskL = id => ["tasks", id]

  return {
    filterTasksBy: text => {
      actionS.next({
        type: "filterTasksBy",
        text,
        updateModel: m => L.set("taskFilterText", text.trim().toLowerCase(), m)
      })
    },
    markTaskDone: (id, isDone) => {
      actionS.next({
        type: "markTaskDone",
        id,
        isDone,
        updateModel: m => L.set([taskL(id), "isDone"], isDone, m)
      })
    },
    addTask: name => {
      actionS.next({
        type: "addTask",
        name,
        updateModel: m => L.assign("tasks", { [uuid()]: { isDone: false, name } }, m)
      })
    },
    deleteTask: id => {
      actionS.next({
        type: "deleteTask",
        id,
        updateModel: m => L.remove(taskL(id), m)
      })
    }
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

const App = ({ model, controller }) => {
  const filteredTasks = Object.entries(model.tasks).filter(([_, t]) =>
    t.name.toLowerCase().includes(model.taskFilterText)
  )

  return (
    <div className="app">
      <SearchTaskField filterTasksBy={controller.filterTasksBy} value={model.taskFilterText} />
      <div>Found {filteredTasks.length} tasks</div>
      <TaskList tasks={filteredTasks} deleteTask={controller.deleteTask} markTaskDone={controller.markTaskDone} />
      <AddTaskField addTask={controller.addTask} />
    </div>
  )
}

const rootEl = document.getElementById("root")

stateO.subscribe(({ model }) => {
  console.log("render model:", model) // debugging only
  ReactDOM.render(<App model={model} controller={controller} />, rootEl)
})
