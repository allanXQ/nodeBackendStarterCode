# Peer To Peer Trade Logic

## models

1. Orders: {
   OrderId,
   type,
   userId,-buyer or seller
   asset,
   amount,
   price,
   status-pending,
   created
   }

2. Closed:{
   orderId,
   buyerid,
   sellerId
   asset,
   amount,
   price,
   status-closed,
   created
   }
3. Escrow: {
   orderId,
   userId,
   type,
   asset,
   amount,
   cash,
   created
   }

## Order States

1. Pending
2. Closed

## Buy Logic

Client sends buy request.

Validation for userId, asset, amount.
Check for sufficient account balance of buyer.
If not suficient return 400

get price from binance wss

Check if a sell order exists with the available asset name, price and amount and user is not same as seller.

If order exists then:

Minus the balance and add it to the seller. Check for the order escrow and update the order status to closed. Update the buyer's portfolio balance. Delete order escrow

If order doesn't exist then:

Create a new pending buy order.
Minus buyer balance and add to escrow

## Sell logic

Client sends sell request.

Validation for userId, asset, amount, price.
Check for sufficient portfolio balance of seller.
If not suficient return 400

Check if a buy order exists with the available asset name, price and amount and user is not same as buyer.

If order exists then:

Minus the portfolio balance and add it to the buyer portfolio. Check for the order escrow. update the order status to closed. Update the buyer's portfolio balance. Delete order escrow

If order doesn't exist then:

Create a new pending sell order.
Minus seller portfolio balance and add to escrow
