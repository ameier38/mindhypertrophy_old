// import path
var path = require('path')

//import classNames
var classNames = require('classnames')

//import lodash
var _ = require('lodash')

//import Loading
var Spinner = require('react-spinkit');

//import components
import React, { Component } from 'react';
import {Link, browserHistory} from 'react-router'
import {Grid,Row,Col,ButtonToolbar,Button,Navbar,Nav,NavItem,Well,Image} from 'react-bootstrap'
import {Markdown} from './Markdown.jsx'

//import logo image
var logoImage = require('../images/mindhypertrophy.png')

//define api paths
const cardApi = 'https://mindhypertrophy.azurewebsites.net/api/cards'
const tagApi = 'https://mindhypertrophy.azurewebsites.net/api/tags'
// const cardApi = 'http://localhost:5000/api/cards'
// const tagApi = 'http://localhost:5000/api/tags'

class Navigation extends Component{
    render(){
        return(
            <div id="navigation">
                <Navbar fixedTop inverse >
                    <Nav pullLeft>
                        <Navbar.Brand>
                            <Link to="/">Mind Hypertrophy</Link>                      
                        </Navbar.Brand>
                    </Nav>
                    <Nav pullRight>
                        <Navbar.Brand>
                            <Link to="/about">About</Link>                      
                        </Navbar.Brand>
                        <Navbar.Brand>
                            <Link to="/contact">Contact</Link>                      
                        </Navbar.Brand>                    
                    </Nav>
                </Navbar>
            </div> 
        );
    }
}

class TagFilter extends Component{
    render(){      
        return(
            <div id="tag-filter">          
                <Grid>
                    <Well bsSize="small">
                        <TagContainer 
                            tags={this.props.tags}
                            onClick={this.props.onClick} />
                    </Well>
                </Grid>
            </div>
        );
    }
}


//Card
class Card extends Component{
    render(){
        return (
            <Col xs={12} sm={6}>
                <div className="card clickable" onClick={this.props.onClick.bind(null,`/articles/${this.props.id}`)}>
                    <div className="card-header">
                        <h3 className="card-header-title">{this.props.title}</h3>
                        <span className="card-header-date">{this.props.createdDate}</span>
                    </div>
                    <div className="card-summary">
                        <p>{this.props.summary}</p>
                    </div>
                    <TagContainer tags={this.props.tags} onClick={this.props.onClick} />
                </div>
            </Col>
        );
    }
}

//CardComments
class CardComments extends Component{
    render(){
        return (
            <Col xs={12}>
                <div className="card">
                    <div className="card-content">
                        <ReactDisqusThread
                            shortname="mindhypertrophy"
                            identifier={this.props.identifier.toString()}
                            title={this.props.title}
                            url={"http://mindhypertrophy.com"}
                        />
                    </div>
                </div>
            </Col>
        );
    }
}

//TagContainer
class TagContainer extends Component{
    render(){
        const tagNodes = this.props.tags.map(function(tag){
            return(
                <Tag key={tag.Id} tagId={tag.Id} tagName={tag.Name} onClick={this.props.onClick} />      
            ); 
        }.bind(this));
        return (
            <div className="tag-container">
                <ButtonToolbar>
                    {tagNodes}
                </ButtonToolbar>
            </div>
        );  
    }
}

//Tag
class Tag extends Component{
    render(){
        const queryPath = { pathname: "/", query: { tagId: this.props.tagId }}
        const style = (this.props.tagId==1) ? "primary" : "default"
        return (
            <Button bsSize="xsmall" bsStyle={style} onClick={this.props.onClick.bind(this,queryPath)}>{this.props.tagName}</Button>
        );
    }
}

//Footer
class Footer extends Component{
    render(){
        return(
            <Grid id="footer">
                <Row>
                    <Col xs={6}>
                        <Link to="/">MindHypertrophy</Link>
                    </Col>
                    <Col xs={6}>
                        <Link to="/about">About</Link>
                        <Link to="/contact">Contact</Link>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

//Jumbotron
class Jumbotron extends Component{
    render(){
        var jumboStyle = {backgroundImage: `url(${this.props.imageUrl})`}
        var logo = this.props.includeLogo ? (<img src={logoImage} />) : null
        return(
            <div className="jumbotron" style={jumboStyle}>
                <Grid>
                    <div>
                        {logo}
                        <h1>{this.props.title}</h1>
                        <p>{this.props.description}</p>
                    </div>
                </Grid>               
            </div>
        );
    }
}

//CardDetail
export class CardDetail extends Component{
    constructor(props) {
        super(props)
        this.state = { 
            cardDetail: null,
            loading: true
        }
        this.loadFromServer = this.loadFromServer.bind(this)
    }
    componentDidMount(){
        //fetch data
        var apiUrl = cardApi + '/' + this.props.params.id
        console.log("componentDidMount apiUrl: " + apiUrl)
        this.loadFromServer(apiUrl)
    }
    loadFromServer(apiUrl){
        var xhr = new XMLHttpRequest()
        xhr.open("get", apiUrl, true)
        xhr.onload = () => {
            var data = JSON.parse(xhr.responseText)
            console.log('loadFromServer cardDetail')
            this.setState({
                cardDetail: data,
                loading: false 
            })
        }
        xhr.send()
    }
    handleClick(url){
        browserHistory.push(url)
    }
    render(){
        if (this.state.loading){
            return (
                <div className="card-container">
                    <Jumbotron title="Loading..." />
                    <Grid>
                        <Row>
                            <Col xs={12}>
                                <Spinner spinnerName='three-bounce'/>
                            </Col>
                        </Row> 
                    </Grid>
                </div>    
            ) 
        }
        else {
            return (
                <div className="card-container">
                    <Jumbotron
                        title={this.state.cardDetail.Title}
                        description={this.state.cardDetail.CreatedDate}
                        imageUrl={this.state.cardDetail.ImageUrl} />
                    <TagFilter 
                        tags={this.state.cardDetail.Tags}
                        onClick={this.handleClick} />
                    <Grid>
                        <Row>
                            <Col xs={12}>
                                <div className="card">
                                    <div className="card-content">
                                        <Markdown>
                                            {this.state.cardDetail.Content}
                                        </Markdown>
                                    </div>
                                </div>
                            </Col>
                        </Row> 
                    </Grid>
                </div>    
            )
        } 
    } 
}

//CardContainer
export class CardContainer extends Component{
    constructor(props) {
        super(props)
        this.state = { 
            cards: [],
            tags: [],
            loading: true
        }
        this.updateData = this.updateData.bind(this)
        this.loadFromServer = this.loadFromServer.bind(this)
    }
    componentDidMount(){
        var query = this.props.location.search
        console.log("componentDidMount query: " + query)
        this.updateData(query)
    }
    componentWillReceiveProps(nextProps) {
        var query = nextProps.location.search
        console.log("componentWillReceiveProps new query: " + query)
        var old_query = this.props.location.search
        console.log("componentWillReceiveProps old query: " + old_query)
        if (query !== old_query) {this.updateData(query)}
    }
    updateData(query){
        //load the cards
        var all_query = '?tagId=1'
        console.log("updateData query: " + query)
        if (_.isEmpty(query) || query == all_query) {
            this.loadFromServer(cardApi, 'cards')
        }
        else {
            this.loadFromServer(cardApi + query, 'cards')
        }
        //load the tags
        this.loadFromServer(tagApi, 'tags')  
    }
    loadFromServer(apiUrl, stateProp){
        var xhr = new XMLHttpRequest()
        xhr.open("get", apiUrl, true)
        xhr.onload = () => {
            var data = JSON.parse(xhr.responseText)
            console.log('loadFromServer stateProp: ' + stateProp)
            this.setState({
                [stateProp]: data,
                loading: false 
            })
        }
        xhr.send()
    }
    handleClick(url){
        browserHistory.push(url)
    }
    render(){
        const cardNodes = this.state.cards.map(function(card){
            return (
                <Card 
                    key={card.Id} 
                    id={card.Id}
                    title={card.Title} 
                    summary={card.Summary} 
                    createdDate={card.CreatedDate} 
                    tags={card.Tags}
                    onClick={this.handleClick}
                />
            );
        }.bind(this));
        if (this.state.loading){
            return (
                <div className="card-container">
                    <Jumbotron title="Loading..." />
                    <Grid>
                        <Row>
                            <Col xs={12}>
                                <Spinner spinnerName='three-bounce'/>
                            </Col>
                        </Row> 
                    </Grid>
                </div>    
            ) 
        }
        else {
            return(
                <div className="card-container">
                    <Jumbotron
                        title="Train your brain"
                        description="Give your brain a workout! Click an article below to learn more."
                        imageUrl="/images/neurons.jpg" 
                        includeLogo={true} />
                    <TagFilter 
                        tags={this.state.tags}
                        onClick={this.handleClick} />
                    <Grid>
                        <Row>
                            {cardNodes}
                        </Row> 
                    </Grid>
                </div>
            )
        }
        
    }  
}

//About
export class About extends Component{
    render(){
        return(
            <div className="card-container">
                    <Jumbotron
                        title="About"
                        description="A blog built using React framework" 
                        includeLogo={true} />
                    <Grid>
                        <Row>
                            <Col xs={12}>
                                <div className="card">
                                    <div className="card-content">
                                        <div>
                                            <blockquote>
                                                <p>
                                                    <i>Hypertrophy:</i> excessive development of an organ or part; 
                                                    exaggerated growth or complexity
                                                </p>
                                                <footer>Merriam-Webster</footer>
                                            </blockquote>
                                            <p>
                                                Hello! I created this blog because I wanted a fun and interesting way to improve my writing 
                                                and learn about new things. One of the best ways to learn, in my opinion, is to teach what 
                                                you are trying to learn. If you can explain something simply and clearly to someone else, 
                                                then you probably have a pretty good understanding of the subject matter. Therefore, I try
                                                to structure each post as a mini lesson, with someone completely unfamiliar with the subject as
                                                the audience in mind.
                                            </p>
                                            <blockquote className="blockquote-reverse">
                                                <p>"I couldn't do it. I couldn't reduce it to the freshman level. That means we don't really understand it."</p>
                                                <footer>Richard Feynman, on explaining why spin one-half particles obey Fermi Dirac statistics</footer>
                                            </blockquote>
                                            <p>
                                                All the code is hosted on GitHub <a href="https://github.com/ameier38/mindhypertrophy.git">here</a>.
                                                I welcome all comments on how I could improve the site. Currently exploring how to use redux...
                                            </p>
                                            <p>
                                                I leveraged a number of open source frameworks including:
                                            </p>
                                            <ul>
                                                <li><a href="https://github.com/gaearon/babel-plugin-react-transform.git">React Transform</a></li>
                                                <li><a href="https://github.com/reactjs/react-router.git">React Router</a></li>
                                                <li><a href="https://react-bootstrap.github.io/">React Bootstrap</a></li>
                                                <li><a href="http://getbootstrap.com/">Twitter Bootstrap</a></li>
                                            </ul>         
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row> 
                    </Grid>
                </div>
        )
    }
}

//Contact
export class Contact extends Component{
    render(){
        return(
            <div className="card-container">
                    <Jumbotron
                        title="Contact"
                        description="Something to say?" 
                        includeLogo={true} />
                    <Grid>
                        <Row>
                            <Col xs={12}>
                                <div className="card">
                                    <div className="card-content">
                                        <div>
                                            <p>
                                                Use below links for appropiate contact.
                                            </p>
                                            <ul>
                                                <li><a href="https://github.com/ameier38/mindhypertrophy/issues">Code issues</a></li>
                                                <li><a href="mailto:info@mindhypertrophy.com">Say hi</a></li>
                                            </ul>         
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row> 
                    </Grid>
                </div>
        )
    }
}

//NotFound
export class NotFound extends Component{
    render() {
        return <h2>Not found</h2>
    }
}

//App
export class App extends Component{
    constructor(props) {
        super(props)
    }
    render(){
        return(
            <div id="page-container">
                <Navigation />
                <div id="view-container">       
                    {this.props.children}
                </div>
                <Footer />
            </div>  
        );
    }
}