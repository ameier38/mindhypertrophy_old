//import css
require("bootstrap-webpack");
import '../css/app.css'   //add second to override the bootstrap styles

//import classNames
var classNames = require('classnames')

//import Loading
//TODO: figure out why import does not work
var Spinner = require('react-spinkit');

//import componenets
import React, { Component } from 'react';
import {Link} from 'react-router'
import {Grid,Row,Col,ButtonToolbar,Button,Navbar,Well,Image} from 'react-bootstrap'

//import CardStore
import CardStore from './CardStore'

class Navigation extends Component{
    render(){
        return(
            <div id="navigation">
                <Navbar fixedTop inverse >
                    <div className="navbar-header pull-left">
                        <Link className="navbar-brand btn" to="/">MindHypertrophy</Link>
                    </div>
                    <div className="navbar-header pull-right">
                        <ul className="navbar-nav pull-left list-inline">
                            <li><Link className="navbar-brand btn" to="/about">About</Link></li>
                            <li><Link className="navbar-brand btn" to="/contact">Contact</Link></li>
                        </ul>
                        <Navbar.Toggle onClick={this.props.toggleSidebar}/>
                    </div>
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
                            tags={this.props.tags} />
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
                <div className="card clickable">
                    <div className="card-header">
                        <h3 className="card-header-title"><Link to={`/articles/${this.props.id}`}>{this.props.title}</Link></h3>
                        <span className="card-header-date">{this.props.createdDate}</span>
                    </div>
                    <div className="card-summary">
                        <p>{this.props.summary}</p>
                    </div>
                    <TagContainer tags={this.props.tags} />
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
                <Tag key={tag.Id} tagName={tag.Name} />      
            ); 
        });
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
        return (
            <Link to={{ pathname: "/", query: { tagId: this.props.key }}} className="btn btn-xs" role="button">{this.props.tagName}</Link>
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
            tags: []
        }
        //bind updateCards method to the CardContainer instance
        this.updateData = this.updateData.bind(this)
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
    updateData() {
        this.setState({
            cards: CardStore.getCards(),
            tags: CardStore.getTags()
        })
    }
    
    //Invoked when a component is receiving new props. This method is not called for the initial render.
    componentWillReceiveProps(nextProps) {
        //let is scoped to the nearest enclosing block
        let {query} = nextProps.location
        this.setState({
            //if the query is defined then get cards for particular tagId, otherwise get all cards
            cards: query ? CardStore.getCards(query.tagId) : CardStore.getCards()
        })
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
                />
            );
        });
        return(
            <div className="card-container">
                <Jumbotron
                    title="Train your brain"
                    description="Give your brain a workout! Click an article below to learn more."
                    imageUrl="url(/images/neurons.jpg)" />
                <TagFilter 
                    sidebarVisible={this.props.sidebarVisible}
                    tags={this.state.tags} />
                <Grid>
                    <Row>
                        {cardNodes}
                    </Row> 
                </Grid>
            </div>
        );
    }  
}

//About
export class About extends Component{
    render(){
        return(
            <div>
                <h1>About</h1>
            </div>
        )
    }
}

//Contact
export class Contact extends Component{
    render(){
        return(
            <div>
                <h1>Contact</h1>
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
                        sidebarVisible: this.state.sidebarVisible
                    })}
                </div>
                <Footer />
            </div>  
        );
    }
}