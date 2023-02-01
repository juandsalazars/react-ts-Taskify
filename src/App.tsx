import React, { useState, useEffect } from 'react';
import './App.css';
import InputField from './components/InputField';
import TodoList from './components/TodoList';
import { Todo } from './model';
import { DragDropContext, Draggable, DropReason, DropResult } from 'react-beautiful-dnd';

const App: React.FC = () => {

  const [todo, setTodo] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const lsTodos = localStorage.getItem('todos');
    let todos: Todo[] = [];
    if (lsTodos !== null) {
      todos = JSON.parse(lsTodos);
    } 

    setTodos(todos);

    const lsCompletedTodos = localStorage.getItem('completedTodos');
    let completedTodos: Todo[] = [];
    if (lsCompletedTodos !== null) {
      completedTodos = JSON.parse(lsCompletedTodos);
    } 
    
    setCompletedTodos(completedTodos);
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('completedTodos', JSON.stringify(completedTodos));
  }, [completedTodos]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if(todo){
      setTodos([...todos, {id: Date.now(), todo: todo, isDone: false}]);
      setTodo('');
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId 
      &&
      destination.index === source.index
    )
      return;
    
    let
      add,
      active = todos,
      complete = completedTodos;
    
    if (source.droppableId === 'TodosList') {
      add = active[source.index];
      active.splice(source.index, 1);
    } else {
      add = complete[source.index];
      complete.splice(source.index, 1);
    }

    if(destination.droppableId === 'TodosList') {
      add.isDone = false;
      active.splice(destination.index, 0, add);
    } else {
      add.isDone = true;
      complete.splice(destination.index, 0, add);
    }
    
    setCompletedTodos(complete);
    localStorage.setItem('completedTodos', JSON.stringify(completedTodos));

    setTodos(active);
    localStorage.setItem('todos', JSON.stringify(todos));
  };


  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="App">
        <span className='heading'>Taskify</span>
        <InputField todo={todo} setTodo={setTodo} handleAdd={handleAdd}/>
        <TodoList
          todos={todos}
          setTodos={setTodos}
          completedTodos={completedTodos}
          setCompletedTodos={setCompletedTodos} />
      </div>
    </DragDropContext>
  );
}

export default App;
