import React from 'react';
import Markdown from 'markdown-it';
var mk = require('markdown-it-katex')
var hljs = require('highlight.js'); // https://highlightjs.org/

// Actual default values
var md = require('markdown-it')({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }

    return ''; // use external default escaping
  }
});

var Remarkable = React.createClass({

  getDefaultProps() {
    return {
      container: 'div',
      options: {highlight: this.highlightSyntax},
    };
  },

  render() {
    var Container = this.props.container;

    return (
      <Container>
        {this.content()}
      </Container>
    );
  },

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.options !== this.props.options) {
      this.md = new Markdown(nextProps.options);
      this.md.use(mk);
    }
  },

  highlightSyntax(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }

    return ''; // use external default escaping
  },

  content() {
    if (this.props.source) {
      return <span dangerouslySetInnerHTML={{ __html: this.renderMarkdown(this.props.source) }} />;
    }
    else {
      return React.Children.map(this.props.children, child => {
        if (typeof child === 'string') {
          return <span dangerouslySetInnerHTML={{ __html: this.renderMarkdown(child) }} />;
        }
        else {
          return child;
        }
      });
    }
  },

  renderMarkdown(source) {
    if (!this.md) {
      this.md = new Markdown(this.props.options);
      this.md.use(mk);
    }

    return this.md.render(source);
  }

});

export default Remarkable;
