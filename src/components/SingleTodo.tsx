import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../model';
import { FaRegEdit } from 'react-icons/fa';
import { MdOutlineDeleteOutline, MdDoneOutline } from 'react-icons/md';
import './styles.css';

interface Props {
    todo: Todo;
    todos: Todo[];
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

const SingleTodo: React.FC<Props> = ({ todo, todos, setTodos }) => {

    const [edit, setEdit] = useState<boolean>(false);
    const [editTodo, setEditTodo] = useState<string>(todo.todo);


    const handleDone = (id: number) => {
        setTodos(todos.map(todo => (
            todo.id === id ? 
            {...todo, isDone: !todo.isDone}
            :
            {...todo}
        )))
    }

    const handleDelete = (id: number) => {
        setTodos(todos.filter(todo => (todo.id !== id)))
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
        <form className='todos__single' onSubmit={(e) => handleEdit(e, todo.id)}>
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
    )
}

export default SingleTodo