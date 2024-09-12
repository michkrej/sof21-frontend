import React, { Component, forwardRef } from 'react';

import OrderItemCard from './OrderItemCard';

import {
  Card,
  CardMedia,
} from '@rmwc/card';
import {
  List,
  ListItem,
  ListItemText,
  ListItemPrimaryText,
  ListItemSecondaryText
} from '@rmwc/list';
import { TextField } from '@rmwc/textfield';
import { IconButton } from '@rmwc/icon-button';
import { Button } from '@rmwc/button';
import { CircularProgress } from '@rmwc/circular-progress';
import { Grid, GridCell, GridInner } from '@rmwc/grid';
import { ListDivider } from '@rmwc/list';

import { FormattedMessage, injectIntl } from 'react-intl'

import posed from 'react-pose';

import { connect } from 'react-redux';

class OrderSummary extends Component{
  checkReceipt = receipt_url => {
    window.open(receipt_url, '_blank');
  }

  render(){

    var totCost = 0;
    if(!this.props.isLoading && this.props.items !== null) {
      this.props.items.order_items.forEach( item =>{
        // const baseProd = this.props.products[this.props.baseProducts[order.prodID].base_id];
        // const productCost = baseProd.products[this.props.baseProducts[order.prodID].prod_id].actual_cost;

        totCost += item.cost * item.amount // order.amount
      });
    }

    return(
      <React.Fragment>
        <Card className='order-summary'>
          <Grid style={{width: '100%'}}>
            <GridInner>
            <GridCell desktop='12' tablet='8' phone='4' className='h-center'>
              <b> Order </b> {" #" + this.props.order}
            </GridCell>
            <GridCell desktop='12' tablet='8' phone='4'>
              <ListDivider/>
            </GridCell>
              {(this.props.items != null && this.props.items.order_items != null) ?
                Object.keys(this.props.items.order_items).map((key) => (
                <GridCell desktop='12' tablet='8' phone='4' key={key} >
                  <OrderItemCard
                    item={this.props.items.order_items[key]}
                  />
                </GridCell>

              ))
               : null
            }
            <GridCell desktop='12' tablet='8' phone='4'>
              <ListDivider/>
            </GridCell>
            <GridCell desktop='12' tablet='8' phone='4' style={{display: 'flex', justifyContent: 'space-between', margin: '0px 16px'}}>
              <b>
                <FormattedMessage id='Cart.total' />
              </b>
              <b>
              {totCost + (this.props.intl.locale === 'sv' ? ' Kr' : " SEK")}
              </b>
{/*               <Button raised onClick={() => (this.checkReceipt(this.props.receipt))} >
                <FormattedMessage id='Shop.receipt' />
              </Button> */}
            </GridCell>
            </GridInner>
          </Grid>
        </Card>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  items: state.orders.items,
  baseProducts: state.orders.items,
  isLoading: state.orders.loading_items,
  errors   : state.orders.items_error
});

export default connect(mapStateToProps)(injectIntl(OrderSummary));
