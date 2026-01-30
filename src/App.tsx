import './App.scss';
import { useState } from 'react';

import usersFromServer from './api/users';
import todosFromServer from './api/todos';

export const App = () => {
  const [listTodos, setListTodos] = useState(todosFromServer);
  const [title, setTitle] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [hasTitleError, setHasTitleError] = useState(false);
  const [hasUserError, setHasUserError] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const isTitleEmpty = !title.trim();
    const isUserNotSelected = !userId || userId === 0;

    if (isTitleEmpty) {
      setHasTitleError(true);
    }

    if (isUserNotSelected) {
      setHasUserError(true);
    }

    if (isTitleEmpty || isUserNotSelected) {
      return;
    }

    const selectedUser = usersFromServer.find(u => u.id === userId);
    const newId = Math.max(0, ...listTodos.map(t => t.id)) + 1;

    const newTodo = {
      id: newId,
      title: title.trim(),
      userId: userId,
      completed: false,
      user: selectedUser,
    };

    setListTodos([...listTodos, newTodo]);

    setTitle('');
    setUserId(0);
  }

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form action="/api/todos" method="POST" onSubmit={handleSubmit}>
        <div className="field">
          <input
            type="text"
            data-cy="titleInput"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              setHasTitleError(false);
            }}
          />
          {hasTitleError && <span className="error">Please enter a title</span>}
        </div>

        <div className="field">
          <select
            data-cy="userSelect"
            value={userId ?? 0}
            onChange={e => {
              setUserId(Number(e.target.value));
              setHasUserError(false);
            }}
          >
            <option value="0" disabled>
              Choose a user
            </option>
            {usersFromServer.map(user => (
              <option value={user.id} key={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          {hasUserError && <span className="error">Please choose a user</span>}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>

      <section className="TodoList">
        {listTodos.map(todo => {
          const user = usersFromServer.find(u => u.id === todo.userId);

          return (
            <article
              key={todo.id}
              data-id={todo.id}
              className={`TodoInfo ${todo.completed ? 'TodoInfo--completed' : ''}`}
            >
              <h2 className="TodoInfo__title">{todo.title}</h2>

              <a className="UserInfo" href={`mailto:${user?.email}`}>
                {user?.name}
              </a>
            </article>
          );
        })}
      </section>
    </div>
  );
};
