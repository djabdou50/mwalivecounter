/**
 * Created by Abdeltif Bouziane on 14/02/2019.
 */

import React, {Component} from 'react';
import Firebase from '../config/Firebase';


class LatestComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            candidats: [],
        };

        this.app = Firebase;
        this.database = this.app.database().ref().child('candidats');

        this.candidatsRef = this.database.limitToLast(5);
    }


    componentWillMount() {

        let candidats = [];

        const query = this.candidatsRef.orderByChild('category').once('value', function (data) {
            data.forEach(function (childSnapshot) {
                var childKey = childSnapshot.key;
                var data = childSnapshot.val();

                candidats.push({
                    img: data.img,
                    category: data.category,
                    votes: data.votes,
                    link: data.link,
                    name: data.name,
                    id: childSnapshot.key
                });

                this.setState({
                    candidats : candidats
                });

            }.bind(this));
        }.bind(this));

    }

    componentDidMount() {

        console.log("mount did")

        this.lastChangess = this.app.database().ref().child('candidats').on("child_changed", function(data) {

            console.log("changed", data.key)

            let candidats = this.state.candidats;

            candidats.shift();

                    let candida = {
                        img: data.val().img,
                        category: data.val().category,
                        votes: data.val().votes,
                        link: data.val().link,
                        name: data.val().name,
                        id: data.key
                    };

                    candidats.push(candida)

            this.setState({
                candidats : candidats
            });

        }.bind(this));


    }

    componentWillUnmount() {

        this.candidatsRef.off("child_changed")
        // unsubscribe
        this.app.database().ref().child('candidats').off("child_changed", this.lastChangess)

        console.log("unmw")
    }


    listCandidats(){

        let candidats = [];

        for( let i in this.state.candidats ){
            // console.log(this.state.candidats[i])
            let classDiv;
            if(this.state.lastChanged == this.state.candidats[i].id){ classDiv = 'latest' }else{ classDiv = '' }
            candidats.push(<div className={classDiv +" media text-muted pt-3"} id={this.state.candidats[i].id} key={this.state.candidats[i].id}>
                <img src={this.state.candidats[i].img} width="32px" height="32px" alt={this.state.candidats[i].name} className="mr-2 rounded" />
                <div className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                    <div className="d-flex justify-content-between align-items-center w-100">
                        <strong className="text-gray-dark">{this.state.candidats[i].name} </strong>
                        <a href={this.state.candidats[i].link} target="_blank" rel="noopener noreferrer">View</a>
                    </div>
                    <span className="d-block">{this.state.candidats[i].votes}</span>
                </div>
            </div>)
        }

        return candidats;
    }


    render() {
        return (
            <div className="col-12">
                <h1>latest</h1>
                {this.listCandidats()}
            </div>
        );
    }
}

export default LatestComponent;