import React, { Component } from "react"
import { FormattedMessage, injectIntl, Intl } from "react-intl"
import { connect } from "react-redux"

import { Button } from "@rmwc/button"
import { Grid, GridCell, GridInner } from "@rmwc/grid"
import ScaleLoader from "react-spinners/ScaleLoader"
import {
  ElementsConsumer,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js"

import LoadButton from "../forms/components/LoadButton"
import {
  stripePurchaseBegin,
  stripePurchaseFailure,
  stripePurchase,
  stripeReset,
} from "../../actions/shop"
import { openDialog } from "../../actions/dialog"

import { PosedErrorText } from "../forms/components/FormTextInput"
import { withRouter, Redirect } from "react-router-dom"

import api from "../../api/axiosInstance"

const mapStateToProps = (state) => ({
  stripe_loading: state.shop.stripe_loading,
  stripe_complete: state.shop.stripe_complete,
  error: state.shop.stripe_error,
  user: state.reduxTokenAuth.currentUser,
})

const cardToClass = {
  visa: "pf pf-visa",
  mastercard: "pf pf-mastercard",
  amex: "pf pf-american-express",
  discover: "pf pf-discover",
  diners: "pf pf-diners",
  jcb: "pf pf-jcb",
  unknown: "pf pf-credit-card",
}

class CheckoutForm extends Component {
  /* A credit card form class used in checkout. Uses stripes react components
   * (https://stripe.com/docs/stripe-js/react)
   */
  constructor(props) {
    super(props)
    this.submit = this.submit.bind(this)
    this.state = {
      cardClass: "unknown",
      cardError: null,
      dateError: null,
      cvcError: null,
      secret: undefined,
    }
  }

  componentDidMount() {
    api
      .get("/store/secret")
      .then((response) => this.setState({ secret: response.data }))
  }

  componentWillUnmount() {
    this.props.dispatch(stripeReset())
  }

  async submit(ev) {
    ev.preventDefault()

    const { stripe, elements } = this.props

    if (
      !stripe ||
      !elements ||
      !this.state.secret ||
      this.props.stripe_complete
    ) {
      return
    }

    this.props.dispatch(stripePurchaseBegin())
    const result = await stripe.confirmCardPayment(this.state.secret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
      },
    })

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      if (result.error.type === "invalid_request_error") {
        this.props.dispatch(
          openDialog(
            <FormattedMessage id='Shop.invalid_request_error.title' />,
            <FormattedMessage id='Shop.invalid_request_error.message' />
          )
        )
      } else {
        this.props.dispatch(
          openDialog(
            <FormattedMessage id='Shop.card_error.title' />,
            <FormattedMessage id='Shop.card_error.message' />
          )
        )
      }

      this.props.dispatch(
        stripePurchaseFailure("Could not verify card details")
      )
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === "succeeded") {
        this.props.dispatch(stripePurchase(result.paymentIntent.id))
      }
    }
  }

  onCardChangeHandler = (event) => {
    if (event.brand) {
      this.setState({ cardClass: event.brand })
    }
    if (event.error) {
      this.setState({ cardError: event.error.message })
    } else {
      this.setState({ cardError: null })
    }
  }

  onDateChangeHandler = (event) => {
    if (event.error) {
      this.setState({ dateError: event.error.message })
    } else {
      this.setState({ dateError: null })
    }
  }

  onCVCChangeHandler = (event) => {
    if (event.error) {
      this.setState({ cvcError: event.error.message })
    } else {
      this.setState({ cvcError: null })
    }
  }

  render() {
    if (this.props.stripe_complete) return <Redirect to='/account/purchases' />

    return (
      <React.Fragment>
        <form onSubmit={this.submit}>
          <GridCell desktop='12' tablet='8' phone='4'>
            <GridInner className='checkout'>
              <GridCell desktop='6' tablet='4' phone='4'>
                <FormattedMessage id='Shop.card_number' />
                <div className='stripe-container'>
                  <CardNumberElement onChange={this.onCardChangeHandler} />
                  <span class='brand' style={{ width: "32px" }}>
                    <i class={cardToClass[this.state.cardClass]}></i>
                  </span>
                </div>
                <PosedErrorText
                  pose={this.state.cardError ? "error" : "noError"}
                  persistent
                  className='form-error-text'
                  style={{ color: "#FF0000" }}
                >
                  {this.state.cardError}
                </PosedErrorText>
              </GridCell>
              <GridCell desktop='3' tablet='2' phone='2'>
                <FormattedMessage id='Shop.expiry_date' />
                <div className='stripe-container'>
                  <CardExpiryElement onChange={this.onDateChangeHandler} />
                </div>
                <PosedErrorText
                  pose={this.state.dateError ? "error" : "noError"}
                  persistent
                  className='form-error-text'
                  style={{ color: "#FF0000" }}
                >
                  {this.state.dateError}
                </PosedErrorText>
              </GridCell>
              <GridCell desktop='3' tablet='2' phone='2'>
                CVC <FormattedMessage id='Shop.code' />
                <div className='stripe-container'>
                  <CardCvcElement onChange={this.onCVCChangeHandler} />
                </div>
                <PosedErrorText
                  pose={this.state.cvcError ? "error" : "noError"}
                  persistent
                  className='form-error-text'
                  style={{ color: "#FF0000" }}
                >
                  {this.state.cvcError}
                </PosedErrorText>
              </GridCell>
            </GridInner>
          </GridCell>
          <GridCell
            desktop='12'
            tablet='8'
            phone='4'
            style={{ marginTop: "16px" }}
          >
            {!this.props.stripe_loading && (
              <LoadButton
                raised
                onClick={this.submit}
                style={{ width: "100%" }}
                loading={this.props.stripe_loading}
                disabled={
                  this.state.cardError ||
                  this.state.dateError ||
                  this.state.cvcError
                }
              >
                <FormattedMessage id='Shop.buy' />
              </LoadButton>
            )}
            {this.props.stripe_loading && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <ScaleLoader loading={true} color={"red"} />
              </div>
            )}
          </GridCell>
          <GridCell desktop='12' tablet='8' phone='4'>
            <i>
              <p style={{ fontSize: "0.8rem", lineHeight: "1rem" }}>
                <FormattedMessage id='Shop.data_handling1' />
                <a
                  target='_blank'
                  rel='noopener noreferrer'
                  href='https://stripe.com/'
                  style={{ color: "var(--mdc-theme-secondary)" }}
                >
                  Stripe
                </a>
                <FormattedMessage id='Shop.data_handling2' />
              </p>
            </i>
          </GridCell>
        </form>
      </React.Fragment>
    )
  }
}

const CheckoutFormWithState = connect(mapStateToProps)(injectIntl(CheckoutForm))

function InjectedCheckoutForm() {
  return (
    <ElementsConsumer>
      {({ stripe, elements }) => (
        <CheckoutFormWithState stripe={stripe} elements={elements} />
      )}
    </ElementsConsumer>
  )
}

export default connect(mapStateToProps)(injectIntl(InjectedCheckoutForm))
