//import classNames
var classNames = require('classnames')

//import lodash
var _ = require('lodash')

//import Loading
//TODO: figure out why import does not work
var Spinner = require('react-spinkit');

//import componenets
import React, { Component } from 'react';
import {Link, browserHistory} from 'react-router'
import {Grid,Row,Col,ButtonToolbar,Button,Navbar,Nav,NavItem,Well,Image} from 'react-bootstrap'

//import CardStore
import CardStore from './CardStore'

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
                        <Navbar.Toggle onClick={this.props.toggleSidebar}/>
                    </Nav>
                </Navbar>
            </div> 
        );
    }
}

class TagFilter extends Component{
    render(){
        //classNames adds the class when value for class key is true
        var tagFilterClass = classNames({
            "show-sidebar" : this.props.sidebarVisible
        });      
        return(
            <div id="tag-filter" className={tagFilterClass}>          
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
        return (
            <Button bsSize="xsmall" onClick={this.props.onClick.bind(this,queryPath)}>{this.props.tagName}</Button>
        );
    }
}

//Footer
class Footer extends Component{
    render(){
        return(
            <Grid id="footer">
                <Row>
                    <Col xs={4}>
                        <Link to="/about">About</Link>
                    </Col>
                    <Col xs={4}>
                        <Link to="/contact">Contact</Link>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

//Jumbotron
//TODO: change to have its own state
class Jumbotron extends Component{
    render(){
        var jumboStyle = {backgroundImage: this.props.imageUrl}
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
        //intialize cards as empty array
        this.state = { 
            cardDetail: null,
            loading: true
        }
        //bind updateDetail method to the CardDetail instance
        this.updateDetail = this.updateDetail.bind(this)
        //initialize CardStore detail
        CardStore.initDetail(this.props.params.id)
    }
    componentDidMount(){
        //Add change listener
        CardStore.addChangeListener(this.updateDetail)
        //fetch data
        this.updateDetail()
    }
    componentWillUnmount(){
        //Remove change listener
        CardStore.removeChangeListener(this.updateDetail)
    }
    updateDetail() {           
        this.setState({
            cardDetail: CardStore.getDetail(),
            loading: false
        })
    }
    render(){
        if (this.state.loading){
            return (
                <div className="card-container">
                    <Spinner spinnerName='three-bounce'/>
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
        //intialize cards as empty array
        //TODO: add loading state prop to use later for spinning icon
        this.state = { 
            cards: [],
            tags: [],
            loading: true
        }
        //bind updateCards method to the CardContainer instance
        this.updateData = this.updateData.bind(this)
        //bind handleClick
        this.handleClick = this.handleClick.bind(this)
    }
    componentDidMount(){
        //Add change listener
        CardStore.addChangeListener(this.updateData)
        //fetch data
        this.updateData()
    }
    componentWillUnmount(){
        //Remove change listener
        CardStore.removeChangeListener(this.updateData)
    }
    updateData(query) {
        this.setState({
            cards: _.isEmpty(query) ? CardStore.getCards() : CardStore.getCardsByTagId(query.tagId),
            tags: CardStore.getTags(),
            loading: false
        })
    }
    //Invoked when a component is receiving new props. This method is not called for the initial render.
    componentWillReceiveProps(nextProps) {
        //let is scoped to the nearest enclosing block
        //TODO: check if location is the same
        let {query} = nextProps.location
        this.updateData(query)
    }
    handleClick(url){
        browserHistory.push(url)
        if (this.props.sidebarVisible) {this.props.toggleSidebar()}
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
                    <Spinner spinnerName='three-bounce'/>
                </div>    
            ) 
        }
        else {
            return(
                <div className="card-container">
                    <Jumbotron
                        title="Train your brain"
                        description="Give your brain a workout! Click an article below to learn more."
                        imageUrl="url(/images/neurons.jpg)" />
                    <TagFilter 
                        sidebarVisible={this.props.sidebarVisible}
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
        //intialize cards as empty array
        //TODO: add loading state prop to use later for spinning icon
        this.state = { 
            sidebarVisible: false
        }
        //initialize CardStore
        CardStore.init()
        //bind toggleSidebar to App
        this.toggleSidebar = this.toggleSidebar.bind(this)
    }
    toggleSidebar(){
        this.state.sidebarVisible ? this.setState({sidebarVisible: false}) : this.setState({sidebarVisible: true})
    }
    render(){
        return(
            <div id="page-container">
                <Navigation 
                    toggleSidebar={this.toggleSidebar.bind(this)} />
                <div id="view-container">       
                    {this.props.children && React.cloneElement(this.props.children, {
                        sidebarVisible: this.state.sidebarVisible,
                        toggleSidebar: this.toggleSidebar
                    })}
                </div>
                <Footer />
            </div>  
        );
    }
}