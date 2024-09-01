import TicketDAO from '../dao/ticketDAO.js';

class TicketRepository {
    async createTicket(ticketData) {
        return await TicketDAO.createTicket(ticketData);
    }

    async getTicketById(ticketId) {
        return await TicketDAO.getTicketById(ticketId);
    }

    async getAllTickets() {
        return await TicketDAO.getAllTickets();
    }
}

export default new TicketRepository();
