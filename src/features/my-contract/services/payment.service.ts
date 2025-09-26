import { cecagemApi } from "@/lib/api-client";
import type { 
  ICreatePaymentDto, 
  IPaymentResponse,
} from "../types/payment.types";

class PaymentService {
  // Crear un nuevo pago
  async createPayment(data: ICreatePaymentDto): Promise<IPaymentResponse> {
    const response = await cecagemApi.post<IPaymentResponse>(
      `/payments`,
      data
    );
    return response;
  }
}

export const paymentService = new PaymentService();