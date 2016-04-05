import React from 'react';
import { render } from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router'
import { App, CardContainer, About, Contact, CardDetail, NotFound } from './js/App.jsx';

const mountNode = document.getElementById('app');

render((
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={CardContainer} />
            <Route path="about" component={About} />
            <Route path="contact" component={Contact} />
            <Route path="articles/:id" component={CardDetail} />
            <Route path="*" component={NotFound} />
        </Route>
    </Router>
    ),mountNode
);
