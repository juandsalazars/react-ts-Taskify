import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../model';
import { FaRegEdit } from 'react-icons/fa';
import { MdOutlineDeleteOutline, MdDoneOutline } from 'react-icons/md';
import './styles.css';
import { Draggable } from 'react-beautiful-dnd';

interface Props {
    todo: Todo;
    todos: Todo[];
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
    completedTodos: Todo[]
    setCompletedTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
    index: number;
}

const SingleTodo: React.FC<Props> = ({
        index,  
        todo, 
        todos, 
        setTodos,
        completedTodos,
        setCompletedTodos
    }) => {

    const [edit, setEdit] = useState<boolean>(false);
    const [editTodo, setEditTodo] = useState<string>(todo.todo);


    const handleDone = (id: number) => {
        if (!todo.isDone){
            let tempTodo = todo;
            tempTodo.isDone = !tempTodo.isDone;
            setCompletedTodos([...completedTodos, tempTodo]);

            setTodos(todos.filter(todo => (todo.id !== id)))
        } else {
            let tempCompletedTodo = todo;
            tempCompletedTodo.isDone = !tempCompletedTodo.isDone;
            setTodos([...todos, tempCompletedTodo]);

            setCompletedTodos(completedTodos.filter(todo => (todo.id !== id)))
        }
        
    }

    const handleDelete = (id: number) => {
        if (!todo.isDone){
            setTodos(todos.filter(todo => (todo.id !== id)));
        }
        else {
            setCompletedTodos(completedTodos.filter(todo => (todo.id !== id)));
        }
    }

    const handleEdit = (e: React.FormEvent, id: number) => {
        e.preventDefault();

        setTodos(todos.map(todo => (
            todo.id === id ? {...todo, todo: editTodo} : {...todo}
        )))

        setEdit(false);
    }

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, [edit])
    

    return (
        <Draggable draggableId={todo.id.toString()} index={index} >
            {(provided, snapshot) => (
                <form
                    className={`todos__single ${snapshot.isDragging? 'drag': ''}`}
                    onSubmit={(e) => handleEdit(e, todo.id)}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    {edit ? (
                        <input
                            value={editTodo}
                            onChange={(e) => setEditTodo(e.target.value)}
                            className='todos__single--text'
                            ref={inputRef}
                        />
                    )
                    :
                    (
                        todo.isDone ? (
                            <s className='todos__single--text'>{todo.todo}</s>
                        )
                        :
                        (
                            <span className='todos__single--text'>{todo.todo}</span>
                        )
                    )}

                    <div>
                        <span
                            className='icon'
                            onClick={(e) => {
                                if (!edit && !todo.isDone) {
                                    setEdit(!edit);
                                    inputRef.current?.focus();
                                }
                                else if (edit && !todo.isDone){
                                    setEdit(!edit);
                                }
                            }}
                        >
                            <FaRegEdit />
                        </span>
                        <span className='icon' onClick={() => handleDelete(todo.id)}>
                            <MdOutlineDeleteOutline />
                        </span>
                        <span className='icon' onClick={() => handleDone(todo.id)}>
                            <MdDoneOutline />
                        </span>
                    </div>
                </form>
            )}
        </Draggable>
    )
}

export default SingleTodo