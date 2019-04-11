import React, { Component } from 'react';
import './App.css';
import Firebase from './config/Firebase'
import Category from './Components/CategoryComponent';
import SingleCategory from './Components/SingleCategoryComponent';
import Latest from './Components/LatestComponent';



class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            categories : [],
            isList: false,
            currentCategory: '',
        };

        this.app = Firebase;
        this.database = this.app.database().ref();
        // this.database = this.app.database().ref().child('categories');
        this.candidatsRef = this.database.child('candidats').limitToLast(100);
        this.catagoriesRef = this.database.child('categories').limitToLast(20);

        this.displayCategory= this.displayCategory.bind(this);
    }


    componentWillMount() {

        let cats = [];

        this.catagoriesRef.on('child_added', (data) => {

            cats.push({
                link: data.val().link,
                name: data.val().name,
                id: data.key
            });
            this.setState({
                categories : cats,
            });

        }, function (err) {
            console.error(err)
        });
    }

    displayCategory = (category) => {
        console.log("disp cat" + category)
        this.setState({
            isList: true,
            currentCategory: category,
        })
    };

    handleGoHome(e){
        this.setState({
            isList: false,

        })
    }

    // getCandidatsFrom(category){
    //     this.candidatsRef.orderByChild('category').equalTo(category).once('value', function (data) {
    //         // console.log(data.val())
    //     }).then(data => {
    //         console.log(data.val())
    //     })
    // }


    listCategories = () => {

        let listCategories = [];
        for( let category in this.state.categories ) {
            listCategories.push(<Category cat={this.state.categories[category]} handleDisplayList={e => this.displayCategory(e)}  key={category}  />);
        }
        return listCategories;
    };


    render() {
    return (
      <div className="App">
        <div className="container">
            <div className="row">
                {/*{ this.state.isList ? '' : <Latest/> }*/}
                { this.state.isList ? <SingleCategory cat={this.state.currentCategory} goHome={e => this.handleGoHome(e)}/> : this.listCategories() }
            </div>
        </div>
      </div>
    );
  }
}

export default App;
