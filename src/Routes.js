import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Locations from './components/Locations/Locations'
import Episodes from './components/Episodes/Episodes'
import GetCharacters from './components/characters/GetCharacters'

function Routes() {
    return (
        <Router>
          <Switch>
              <Route exact path="/" component={GetCharacters} />
              <Route exact path="/episodes" component={Episodes} />
              <Route exact path="/locations" component={Locations} />
          </Switch>
        </Router>
    )
}
  
export default Routes;