import ordersRepo, { OrderRepository } from '../repositories/orders.repository';
import { OrderStatus } from '../interface/order.interface';

export class OrderService {
  constructor(private orderRepository: OrderRepository) {}

  public async changeOrderStatus(
    id: string,
    newStatus: OrderStatus
  ): Promise<void> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error('Order not found');
    }
    order.changeStatus(newStatus);
    await this.orderRepository.updateStatus(id, newStatus);
  }
}

export default new OrderService(ordersRepo);
