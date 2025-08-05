// src/App.tsx

import { useState } from 'react';
// import '../App.css';

interface Todo {
  id: number;
  text: string;
}

function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim() === '') return;
    setTodos([...todos, { id: Date.now(), text: input }]);
    setInput('');
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Vite To-do App</h1>
      <div className="flex mb-4">
        <input
          className="border p-2 flex-grow"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="할 일을 입력하세요"
        />
        <button className="bg-blue-500 text-white px-4 ml-2" onClick={addTodo}>
          추가
        </button>
      </div>
      <ul className="space-y-2">
        {todos.map(todo => (
          <li
            key={todo.id}
            className="flex justify-between items-center bg-gray-100 p-2"
          >
            <span>{todo.text}</span>
            <button
              className="text-red-500"
              onClick={() => removeTodo(todo.id)}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todos;
