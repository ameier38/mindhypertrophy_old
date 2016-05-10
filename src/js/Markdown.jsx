// based on react-remarkable
// https://github.com/acdlite/react-remarkable

import React, { Component } from 'react';
var MarkdownIt = require('markdown-it')
var mk = require('markdown-it-katex')
var hljs = require('highlight.js'); // https://highlightjs.org/

export class Markdown extends Component{
  constructor(props) {
    super(props)
  }
  render() {
    var Container = this.props.container;

    return (
      <Container>
        {this.content()}
      </Container>
    )
  }
  componentWillUpdate(nextProps, nextState) {
    if (nextProps.options !== this.props.options) {
      this.md = new MarkdownIt(nextProps.options)
      this.md.use(mk)
    }
  }
  content() {
    if (this.props.source) {
      return <span dangerouslySetInnerHTML={{ __html: this.renderMarkdown(this.props.source) }} />
    }
    else {
      return React.Children.map(this.props.children, child => {
        if (typeof child === 'string') {
          return <span dangerouslySetInnerHTML={{ __html: this.renderMarkdown(child) }} />
        }
        else {
          return child
        }
      })
    }
  }
  renderMarkdown(source) {
    if (!this.md) {
      this.md = new MarkdownIt(this.props.options);
      this.md.use(mk)
    }
    return this.md.render(source)
  }

}
Markdown.defaultProps = {
    options: {
      highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (__) {}
        }
        return '' // use external default escaping
      }
    },
  container: 'div'
    
}
