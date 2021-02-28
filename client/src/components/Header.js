import React, { Component } from 'react';


class Header extends Component {

    componentDidMount = async() => {

    };

    render() {
        return (
            <div className='container'>
                <h1 className= 'logo'><a href="/">MY SUPPLY DAPP</a></h1>
                <div className='flex-container'>
                    <div className = 'sm-font'> YOUR ACCOUNT: </div>
                    <div className = 'italic centered'> 
                    {this.props.accounts}
                    </div> 
                    <div className = 'sm-font'> BALANCE:</div>
                    <div className = 'italic centered'>
                    {this.props.balance} <em> L.E </em>
                    </div>
                </div>
            </div>
         );

    }
}

export default Header;