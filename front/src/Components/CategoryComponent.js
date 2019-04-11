import React, {Component} from 'react';



class CategoryComponent extends Component {

    constructor(props) {
        super(props);
        this.categoryListing = this.categoryListing.bind(this);
    }


    categoryListing(e, category) {
        this.props.handleDisplayList(category)

    }

    render() {
        return (
            <React.Fragment>
                <div className="col-3" onClick={ e => this.categoryListing(e, this.props.cat.name) }><span>{this.props.cat.name}</span></div>
            </React.Fragment>
        );
    }
}

export default CategoryComponent;
