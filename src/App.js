import "./Assets/styles/main.css";
import CategoryList from "./Components/CategoryList";
import BookList from "./Components/BookList";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { BOOKS_GENRE } from "./config";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          {BOOKS_GENRE &&
            BOOKS_GENRE.map((genre) => {
              return (
                <Route key={genre} path={`/${genre}`}>
                  <BookList genre={genre} />
                </Route>
              );
            })}
          <Route path="/">
            <CategoryList />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
