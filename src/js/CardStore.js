//https://github.com/reactjs/react-router/blob/master/examples/master-detail/ContactStore.js

const cardApi = 'http://localhost:5000/api/cards'
const tagApi = 'http://localhost:5000/api/tags'

//initialize CardStore
let _cards = []
let _tags = []
let _cardDetail = {}
let _initCalled = false
let _changeListeners = []

const CardStore = {

    //initialize the CardStore
    init: function () {
        //if the CardStore has already been initialized then exit
        if (_initCalled) {
            return
        }
        
        //set initililzed flag to prevent re-initilization
        _initCalled = true
        
        //get the cards
        getJSON(cardApi,function (err, res) {
            //load response data into cards array
            res.forEach(function (card) {
                _cards[card.Id] = card
            })
            //Notify that the card data has changed
            CardStore.notifyChange()
        })
        //get the tags
        getJSON(tagApi,function (err, res) {
            //load response data into cards array
            res.forEach(function (tag) {
                _tags[tag.Id] = tag
            })
            //Notify that the card data has changed
            CardStore.notifyChange()
        })    
    },
    
    initDetail: function (id) {
        var qryApi = cardApi + '/' + id
        //get the card detail by id
        getJSON(qryApi,function (err, res) {
            _cardDetail = res
            CardStore.notifyChange()
        })
    },
    
    getCards: function () {
        var cards = []
        for (const id in _cards) {
            cards.push(_cards[id])
        }
        return cards
    },
    
    getTags: function () {
        var tags = []
        for (const id in _tags) {
            tags.push(_tags[id])
        }
        return tags
    },

    getDetail: function () {
        return _cardDetail
    },
    
    notifyChange: function () {
        _changeListeners.forEach(function (listener) {
            listener()
        })
    },
    
    addChangeListener: function (listener) {
    _changeListeners.push(listener)
  },

  removeChangeListener: function (listener) {
    //return array of listeners no equal to listener
    _changeListeners = _changeListeners.filter(function (l) {
      return listener !== l
    })
  }
}

function loadFromServer(apiUrl){
    var xhr = new XMLHttpRequest()
    xhr.open("get", apiUrl, true)
    xhr.onload = () => {
        var data = JSON.parse(xhr.responseText)
        return data
    }
    xhr.send()
}

// function getJSON(url, cb) {
//   const req = new XMLHttpRequest()
//   req.onreadystatechange = function () {
//     //alert(req.readyState + " " + req.status);
//     if (req.readyState == 4 && req.status == 200) {
//       //parse the json reponse into an array object
//       cb(null, JSON.parse(req.response))
//     }
//   }
//   req.open('GET', url)
//   req.send()
// }

function getJSON(url, cb) {
  const req = new XMLHttpRequest()
  req.open('GET', url, true)
  req.onload = () => {
      cb(null, JSON.parse(req.responseText))
  }
  req.send()
}

export default CardStore