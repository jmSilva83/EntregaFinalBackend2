import TicketRepository  from '../repositories/TicketRepository.js';

class TicketService {
    constructor() {
        this.ticketRepository = new TicketRepository();
    }

    async createTicket(data) {
        return this.ticketRepository.create(data);
    }
}

const ticketService = new TicketService();
export default ticketService;
