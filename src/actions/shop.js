import api from '../api/axiosInstance';
import { openDialog } from './dialog';
import { resetCart } from './cart';
import { resetOrders } from './orders';

export const FETCH_PRODUCTS_BEGIN   = 'FETCH_PRODUCTS_BEGIN';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';

export const fetchProductsBegin = () => ({
    type: FETCH_PRODUCTS_BEGIN
});

export const fetchProductsSuccess = response => ({
    type: FETCH_PRODUCTS_SUCCESS,
    payload: response
});

export const fetchProductsFailure = error => ({
    type: FETCH_PRODUCTS_FAILURE,
    payload: { error }
});

export function fetchProducts() {
  return dispatch => {
    dispatch(fetchProductsBegin());
    return api.get(`/shopping_product`, {timeout: 1000 * 10})
    //.then(handleErrors)
      .then(json => {
        dispatch(fetchProductsSuccess(json.data));
        return json.data;
      })
      .catch(error => dispatch(fetchProductsFailure(error)));
  };
}

export function stripePurchase(stripe_id) {
  return dispatch => {
    dispatch(resetOrders());
    return api.post('/store/charge', { stripe_id: stripe_id}, { timeout:1000 * 50})
    .then (json => {
      dispatch(stripePurchaseSuccess(json.data));
      dispatch(resetCart());
      dispatch(openDialog("Payment Success", "Your items can be found on your profile page!"));
      return json.data;
    })
    .catch(error => {
      dispatch(stripePurchaseFailure(error));

      if(!error.response){
        dispatch(openDialog("Payment Error", "Something went wrong with the connection, check if the payment went through before trying again. If the payment went through and you have not recieved your items, please contact us at support@sof.intek.liu.se"))
      }
      else {
        dispatch(openDialog("Payment Error", error.response.data));
      }

    });
  };
};

export const STRIPE_PURCHASE_BEGIN   = 'STRIPE_PURCHASE_BEGIN';
export const STRIPE_PURCHASE_FAILURE = 'STRIPE_PURCHASE_FAILURE';
export const STRIPE_PURCHASE_SUCCESS = 'STRIPE_PURCHASE_SUCCESS';
export const STRIPE_RESET            = 'STRIPE_RESET';

export const stripePurchaseBegin = () => ({
  type: STRIPE_PURCHASE_BEGIN
});

export const stripePurchaseFailure = (error) => ({
  type: STRIPE_PURCHASE_FAILURE,
  payload: { error }
});

export const stripePurchaseSuccess = response => ({
  type: STRIPE_PURCHASE_SUCCESS,
  payload: response
});

export const stripeReset = () => ({
  type: STRIPE_RESET
})
