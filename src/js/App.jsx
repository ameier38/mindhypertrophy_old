//import classNames
var classNames = require('classnames')

//import lodash
var _ = require('lodash')

//import Loading
var Spinner = require('react-spinkit');

//import componenets
import React, { Component } from 'react';
import {Link, browserHistory} from 'react-router'
import {Grid,Row,Col,ButtonToolbar,Button,Navbar,Nav,NavItem,Well,Image} from 'react-bootstrap'

//define api paths
// const cardApi = 'https://mindhypertrophy.azurewebsites.net/api/cards'
// const tagApi = 'https://mindhypertrophy.azurewebsites.net/api/tags'
const cardApi = 'http://localhost:5000/api/cards'
const tagApi = 'http://localhost:5000/api/tags'

class Navigation extends Component{
    render(){
        return(
            <div id="navigation">
                <Navbar fixedTop inverse >
                    <Nav pullLeft>
                        <Navbar.Brand>
                            <Link to="/">MindHypertrophy</Link>                      
                        </Navbar.Brand>
                    </Nav>
                    <Nav pullRight>
                        <Navbar.Brand>
                            <Link to="/about">About</Link>                      
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
                    <Col xs={3}>
                        <Link to="/">MindHypertrophy</Link>
                    </Col>
                    <Col xs={3}>
                        <Link to="/about">About</Link>
                    </Col>
                    <Col xs={3}>
                        <p><a href="https://github.com/ameier38/mindhypertrophy.git">GitHub</a></p>
                    </Col>
                    <Col xs={3}>
                        <p><i>Made in the U.S.A.</i></p>
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
        return(
            <div className="jumbotron" style={jumboStyle}>
                <Grid>
                    <div>
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
            const content = { __html: this.state.cardDetail.Content }
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
                                        <div dangerouslySetInnerHTML={content} />
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
                        imageUrl="/images/neurons.jpg" />
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
                        description="Blog built using React framework" />
                    <Grid>
                        <Row>
                            <Col xs={12}>
                                <div className="card">
                                    <div className="card-content">
                                        <div>
                                            <p>
                                                Hello! I created this blog as a way to learn about Facebook's React framework. 
                                                I hope to continue using it to learn about new topics that spark my interest, 
                                                and I hope teach visitors something new as well.
                                            </p>
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