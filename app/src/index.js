import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

// Import modules.
import App from './App';

// Import styling.
import './styles/index.css';
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// Import bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<BrowserRouter basename='/teamAssessment/app'>
		<App />
	</BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
