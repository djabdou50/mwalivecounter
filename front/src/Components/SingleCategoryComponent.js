import React, {Component} from 'react';
import Firebase from '../config/Firebase';

import ChartsComponent from './chartComponent';


class SingleCategoryComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            category: '',
            candidats: [], //{name:"test",category:"cat",link:"link",id:"15",votes:"15"}
            lastChanged: '',
            dataChats: {
                xAxis: {
                    data : [],
                }
                ,
                series : [
                    {
                        name: '',
                        type: 'line',
                        smooth: true,
                        data: []
                    },
                    ]
            },
        };

        this.app = Firebase;
        this.database = this.app.database().ref();

        this.candidatsRef = this.database.child('candidats').limitToLast(200);

        this.handleHome = this.handleHome.bind(this);
    }


    componentWillMount() {
        console.log("com wil mont single cat" + this.props.cat)


        let candidats = [];

        const query = this.candidatsRef.orderByChild('category').equalTo(this.props.cat).once('value', function (datas) {

            // console.log(datas)
            let i = 0;
            let series = [];
            let AxisData = [];
            datas.forEach(function (childSnapshot) {

                if(i < 5 ){
                    // console.log(childSnapshot.val());

                    let numChilds = childSnapshot.numChildren()

                    let seriesData = [];
                    let count = 0;
                    childSnapshot.forEach( vote =>{
                        // console.log(d.val())

                        if(count > numChilds - 40  ){
                            seriesData.push( vote.val().votes )

                            if( i === 0){
                                // if(vote.val().created_at)
                                    AxisData.push( vote.val().created_at )
                            }
                        }

                        count ++ ;

                    });

                    series.push({
                        name: childSnapshot.val().name,
                        type: 'line',
                        smooth: true,
                        data: seriesData
                    })
                }



                let childKey = childSnapshot.key;
                let data = childSnapshot.val();

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

                this.stateReorder();

                i++;

            }.bind(this));

            this.setState({
                dataChats: {
                    series: series,
                    xAxis: {
                        data : AxisData,
                    }
                }
            });
        }.bind(this));


    }


    handleHome(e, category) {
        this.props.goHome(true)
    }


    stateReorder(){
        let candidats = this.state.candidats;
        candidats.sort(function(a, b){return a.votes - b.votes}).reverse();

        this.setState({
            candidats : candidats
        })
    }


    componentDidMount() {
        this.setState({
            category: this.props.cat,
        });

        this.lastChange = this.candidatsRef.orderByChild("category").equalTo(this.props.cat).on("child_changed", function(data) {

            let candidats = this.state.candidats;
            candidats.map( (candidat, i ) => {

                if( data.key == candidat.id){
                    // console.log("fouuund", candidat.id, data.key)
                    // console.log(i)
                    candidats[i] = {
                        img: data.val().img,
                        category: data.val().category,
                        votes: data.val().votes,
                        link: data.val().link,
                        name: data.val().name,
                        id: data.key
                    };

                    this.lastchanged(data.key)
                }
                return candidat;

            })
            // console.log(candidats)
            this.setState({
                candidats : candidats
            });

            this.stateReorder();

        }.bind(this));




    }

    lastchanged(id = 0){
        this.state.lastChanged = id;
    }

    addChart(e, d){
        console.log(d)
    }


    componentWillUnmount() {
        this.setState({
            category: '',
            candidats: []
        });

        // unsubscribe
        this.app.database().ref().child('candidats').off("child_changed", this.lastChange)

        // console.log("unmw")
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
                        {/*<span className="text-left" onClick={ e => this.addChart( e, this.state.candidats[i].id )}>ADD Chart</span>*/}
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
                <a className="nav-link active" href="#" onClick={e => this.handleHome(e, true)}>Home</a>
                <h1 className="text-center">{this.props.cat}</h1>
                {<ChartsComponent chartsData={this.state.dataChats}/>}
                {this.listCandidats()}
            </div>
        );
    }
}

export default SingleCategoryComponent;
