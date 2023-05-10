import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import { Tickets } from './types/Tickets.js';
import { Prices } from './types/Prices.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';

const MAX_ALLOWED_TICKETS = 20;

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  purchaseTickets(accountId, ...ticketTypeRequests) {

    // these would ideally go in the constructor
    const paymentService = new TicketPaymentService();
    const seatReservationService = new SeatReservationService();

    if(ticketTypeRequests.length < 1){
      throw new InvalidPurchaseException('Minimum one ticket request required');
      // otherwise assume ticketTypeRequests of valid Type
    }

    const total = {
      numberOfTickets: 0,
      numberOfSeats: 0,
      priceOfTickets: 0,
      adultPresent: false
    };

    this.validateAccountId(accountId);

    for (const request of ticketTypeRequests) {
      total.numberOfTickets = total.numberOfTickets + request.getNoOfTickets();

      if(request.getTicketType() === Tickets.ADULT){
        total.adultPresent = true;
      }

      if(total.numberOfTickets > MAX_ALLOWED_TICKETS){
        throw new InvalidPurchaseException(`Error: Max allowed tickets is ${MAX_ALLOWED_TICKETS}. Purchasing ${total.numberOfTickets} is not allowed.`)
      }

      const seats = this.calculateSeatAllocation(request);
      total.numberOfSeats = total.numberOfSeats + seats;

      const amount = this.calculateTicketPrice(request);
      total.priceOfTickets = total.priceOfTickets + amount;
    }

    if(!total.adultPresent){
      throw new InvalidPurchaseException('At least one Adult ticket must be purchased.');
    }

    try {
      paymentService.makePayment(accountId, total.priceOfTickets);
      seatReservationService.reserveSeat(accountId, total.numberOfSeats);
      return total;
    } catch(err){
      console.error(err);
      throw new InvalidPurchaseException('Purchase Tickets Error.' + err.message);
    }
  }

  validateAccountId(accountId){
    if(isNaN(accountId) || accountId <= 0){
      throw new InvalidPurchaseException('Invalid Account ID.')
    }
  }

  calculateSeatAllocation(ticketTypeRequest){
    switch (ticketTypeRequest.getTicketType()) {
    case Tickets.ADULT:
      return ticketTypeRequest.getNoOfTickets()
    case Tickets.CHILD:
      return ticketTypeRequest.getNoOfTickets()
    case Tickets.INFANT:
      return 0;
    default:
      // assume the ticketTypeRequest has already been validated
      // log error here if required
      break;
    }
  }

  calculateTicketPrice(ticketTypeRequest){
    switch (ticketTypeRequest.getTicketType()) {
    case Tickets.ADULT:
      return Prices.ADULT * ticketTypeRequest.getNoOfTickets()
    case Tickets.CHILD:
      return Prices.CHILD * ticketTypeRequest.getNoOfTickets()
    case Tickets.INFANT:
      return 0;
    default:
      // assume the ticketTypeRequest has already been validated
      // log error here if required
      break;
    }
  }
}
