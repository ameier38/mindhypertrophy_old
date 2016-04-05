//import css
import 'bootstrap/dist/css/bootstrap.css'
import '../css/app.css'   //add second to override the bootstrap styles

//import react componenets
import React, { Component } from 'react';

//import CardStore
import CardStore from './CardStore'

class Card extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div>{this.props.title}</div>
        )
    }
}

//App
export class App extends Component{
    constructor(props) {
        super(props)
        //intialize cards as empty array
        //TODO: add loading state prop to use later for spinning icon
        this.state = { cards: [] }
        //initialize CardStore
        CardStore.init()
        //bind updateCards to the App instance
        this.updateCards = this.updateCards.bind(this)
    }
    componentDidMount(){
        //Add change listener
        CardStore.addChangeListener(this.updateCards)
    }
    componentWillUnmount(){
        //Remove change listener
        CardStore.removeChangeListener(this.updateCards)
    }
    updateCards() {
        this.setState({
            cards: CardStore.getCards(),
        })
    }
    render(){
        var cardNodes = this.state.cards.map(function (card){
            return (
                <Card 
                    key={card.Id} 
                    title={card.Title} 
                />
            )
        }) 
        return(
            <div id="page-container">
                <div id="view-container">       
                    {cardNodes}
                </div>
            </div>  
        )
    }
}