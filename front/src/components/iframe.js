import * as React from 'react'
import ReactDOM from 'react-dom'

class FullheightIframe extends React.Component {
  constructor() {
    super()
    this.state = {
      iFrameHeight: '0px',
    }
  }

  render() {
    let content = new Buffer.from(this.props.emailbody, 'base64').toString(
      'utf8'
    )

    if (this.props.mimeType === 'text/plain') {
      // text to html
      content =
        '<p>' +
        content.replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br>') +
        '</p>'
    }

    // handle links opening in the same page
    content = content.replace('target="_self"', 'target="_blank')
    content = `<base target="_blank" />` + content

    return (
      <iframe
        title={this.props.subject}
        style={{
          width: '100%',
          height: this.state.iFrameHeight,
          overflow: 'visible',
        }}
        onLoad={() => {
          const obj = ReactDOM.findDOMNode(this)
          this.setState({
            iFrameHeight:
              obj.contentWindow.document.body.scrollHeight + 20 + 'px',
          })
        }}
        ref="iframe"
        srcDoc={content}
        width="100%"
        height={this.state.iFrameHeight}
        scrolling="no"
        frameBorder="0"
      />
    )
  }
}

export default FullheightIframe
