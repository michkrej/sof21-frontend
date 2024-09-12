import React, { Component } from 'react';

import ArticleCard from '../../components/page_components/ArticleCard';
import Klarna from '../../components/Klarna';

import { pushCart } from '../../actions/cart';

import { FormattedMessage, injectIntl } from 'react-intl'
import { Grid, GridCell, GridInner } from '@rmwc/grid';

import { withRouter, Redirect } from 'react-router-dom';

import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm  from '../../components/shop/CheckoutForm';
import CheckoutItems from '../../components/shop/CheckoutItems';
import Header from '../../components/page_components/NiceHeader';
import { stripePublicKey } from '../../constants';

import { connect } from 'react-redux';

const stripePromise = loadStripe(stripePublicKey)
class Shop extends Component{
  constructor(props) {
    super(props);
    this.intl = this.props.intl;

    this.state = {cart: this.props.items}
  };

  componentDidMount(){
    if(Object.keys(this.state.cart).length > 0){ //Do not push if empty (this causes products to double)
      this.props.pushCart()
    }
  }

  componentDidUpdate(oldProps) {
    const newProps = this.props
    if(oldProps.items !== newProps.items) {
      if(Object.keys(oldProps.items).length === 0){ //Only update if empty from beggining
        this.props.pushCart()
        this.setState({cart: newProps.items});
      }
    }
}

  static pageTitle(){
    return <FormattedMessage id='Checkout.title' />
  }

  static pageNavTitle(){
    return <FormattedMessage id='Checkout.navTitle' />
  }
  render() {
    if (this.props.error !== null) return (<Redirect to='/shop' />);
    return(
      <React.Fragment>
        <Grid className="base-outer-grid base-outer-grid--first">
          <GridInner>
            <GridCell desktop='12' tablet='8' phone='4' >
              <Header>
                <FormattedMessage id='Shop.cart'/>
              </Header>
            </GridCell>
            <CheckoutItems items={this.state.cart}/>
            <GridCell desktop='12' tablet='8' phone='4' >
              <Header>
                <FormattedMessage id='Shop.payment' />
              </Header>
            </GridCell>
            {/* Uses stripes react components to handle payments
              * https://stripe.com/docs/stripe-js/react
              */
            }
            <Elements stripe={stripePromise}>
              <GridCell desktop='12' tablet='8' phone='4' className='stripe example'>
                  <CheckoutForm />
              </GridCell>
            </Elements>
          </GridInner>
        </Grid>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  items : state.cart.cart,
  error : state.cart.error

})

export default connect(mapStateToProps, {pushCart})(withRouter(injectIntl(Shop, { forwardRef: true })));
