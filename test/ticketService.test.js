import TicketService from "../src/pairtest/TicketService";

describe('Ticket Service', () => {
test('Returns true', () => {
        const ticketService = new TicketService();
        const result = ticketService.purchaseTickets(1, null);
        expect(result).toBe(true);
    });
});