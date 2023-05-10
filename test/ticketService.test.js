import TicketService from "../src/pairtest/TicketService";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest";
import { Tickets } from "../src/pairtest/types/Tickets";

describe('Ticket Service', () => {
    test('Successfully Purchase Tickets for 2 Adults for £40', () => {
        const ticketService = new TicketService();
        const result = ticketService.purchaseTickets(1,
            new TicketTypeRequest(Tickets.ADULT, 2)
        );
        expect(result).toStrictEqual({
            numberOfTickets: 2,
            numberOfSeats: 2,
            priceOfTickets: 40,
            adultPresent: true
        });
    });
    test('Successfully Purchase Tickets for 1 Adult and 1 Child for £30', () => {
        const ticketService = new TicketService();
        const result = ticketService.purchaseTickets(1,
            new TicketTypeRequest(Tickets.ADULT, 1),
            new TicketTypeRequest(Tickets.CHILD, 1),
        );
        expect(result).toStrictEqual({
            numberOfTickets: 2,
            numberOfSeats: 2,
            priceOfTickets: 30,
            adultPresent: true
        });
    });
    test('Successfully Purchase Tickets for 1 Adult, 1 Child and 1 infant for £30', () => {
        const ticketService = new TicketService();
        const result = ticketService.purchaseTickets(1,
            new TicketTypeRequest(Tickets.ADULT, 1),
            new TicketTypeRequest(Tickets.CHILD, 1),
            new TicketTypeRequest(Tickets.INFANT, 1),
        );
        expect(result).toStrictEqual({
            numberOfTickets: 3,
            numberOfSeats: 2,
            priceOfTickets: 30,
            adultPresent: true
        });
    });
    test('Successfully Purchase Tickets for 3 Adult, 2 Child and 4 infants for £30', () => {
        const ticketService = new TicketService();
        const result = ticketService.purchaseTickets(1,
            new TicketTypeRequest(Tickets.ADULT, 1),
            new TicketTypeRequest(Tickets.ADULT, 1),
            new TicketTypeRequest(Tickets.ADULT, 1),
            new TicketTypeRequest(Tickets.CHILD, 2),
            new TicketTypeRequest(Tickets.INFANT, 1),
            new TicketTypeRequest(Tickets.INFANT, 3),
        );
        expect(result).toStrictEqual({
            numberOfTickets: 9,
            numberOfSeats: 5,
            priceOfTickets: 80,
            adultPresent: true
        });
    });

    test.each([
        [0],
        [-2],
        ['a'],
    ])('Invalid account ID %s throws error', (id) => {
        const ticketService = new TicketService();
        expect(() => ticketService.purchaseTickets(id,
            new TicketTypeRequest(Tickets.ADULT, 4),
        )).toThrowError(InvalidPurchaseException);
    });
    test('Purchasing a single 20 tickets throws error', () => {
        const ticketService = new TicketService();
        expect(() => ticketService.purchaseTickets(1,
            new TicketTypeRequest(Tickets.ADULT, 20),
        )).toThrowError(InvalidPurchaseException);
    });
    test('Purchasing multiple over 20 tickets throws error', () => {
        const ticketService = new TicketService();
        expect(() => ticketService.purchaseTickets(1,
            new TicketTypeRequest(Tickets.ADULT, 18),
            new TicketTypeRequest(Tickets.INFANT, 1),
            new TicketTypeRequest(Tickets.CHILD, 2),
        )).toThrowError(InvalidPurchaseException);
    });
    test('Purchasing 0 tickets throws error', () => {
        const ticketService = new TicketService();
        expect(() => ticketService.purchaseTickets(1)
        ).toThrowError(InvalidPurchaseException);
    });
    test('Purchasing an Infant ticket without an Adult ticket throws error', () => {
        const ticketService = new TicketService();
        expect(() => ticketService.purchaseTickets(1,
            new TicketTypeRequest(Tickets.INFANT, 1),
        )).toThrowError(InvalidPurchaseException);
    });
    test('Purchasing a Child ticket without an Adult ticket throws error', () => {
        const ticketService = new TicketService();
        expect(() => ticketService.purchaseTickets(1,
            new TicketTypeRequest(Tickets.CHILD, 1),
        )).toThrowError(InvalidPurchaseException);
    });
    test('Purchasing an Infant and a Child ticket without an Adult ticket throws error', () => {
        const ticketService = new TicketService();
        expect(() => ticketService.purchaseTickets(1,
            new TicketTypeRequest(Tickets.CHILD, 2),
            new TicketTypeRequest(Tickets.INFANT, 1),
        )).toThrowError(InvalidPurchaseException);
    });
    test('A ticket with an invalid type throws error', () => {
        expect(() => new TicketTypeRequest('SOMETHING', 2)).toThrowError(TypeError);
    });
    test('A ticket with an invalid amount throws error', () => {
        expect(() => new TicketTypeRequest(Tickets.ADULT, 'one')).toThrowError(TypeError);
    });
});