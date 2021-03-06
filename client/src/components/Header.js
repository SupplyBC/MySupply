import React, { Component } from 'react';


class Header extends Component {
    render() {
        return (
            <div className='container'>
                <h1 className= 'logo'><a href="/"><span aria-label="chain" role="img">⛓️</span> PHARMA CHAIN <span aria-label="chain" role="img">⛓️</span></a></h1>
                <div className='flex-container'>
                    <div className = 'sm-font'> YOUR ACCOUNT: </div>
                    <div className = 'italic centered'> 
                    {this.props.accounts}
                    </div> 
                    <div className = 'sm-font'> BALANCE:</div>
                    <div className = 'italic centered'>
                    {parseInt(this.props.balance,10).toLocaleString('en-US',{style: 'currency', currency: 'USD'})}
                    </div>
                </div>
            </div>
         );

    }
}

export default Header;