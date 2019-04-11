/**
 * Created by Abdeltif Bouziane on 16/02/2019.
 */

import React, {Component} from 'react';
import Firebase from '../config/Firebase'

import React, {Component} from 'react';

class CandidatComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            candidat: [], //{name:"test",category:"cat",link:"link",id:"15",votes: {...}}
        };

        this.app = Firebase;
        this.database = this.app.database().ref();
        this.candidatRef = this.database.child('candidats-v2').limitToLast(100);

    }

    render() {
        return (
            <div>
                candidat
            </div>
        );
    }
}

export default CandidatComponent;
