import React, { Component } from 'react';

class Header extends Component {
    render(){
        return(
            <div style={{ marginTop: 20 }}>
                <h1>React Web</h1>
                { this.props.children }
            </div>
        )
    }
}

export default Header;
