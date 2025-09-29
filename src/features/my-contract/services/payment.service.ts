import { cecagemApi } from "@/lib/api-client";
import type { 
  ICreatePaymentDto, 
  IPaymentResponse,
  IUpdatePaymentDto,
  IUpdatePaymentResponse
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

  // Actualizar estado de un pago (para colaboradores que validan pagos recibidos)
  async updatePayment(paymentId: string, data: IUpdatePaymentDto): Promise<IUpdatePaymentResponse> {
    const response = await cecagemApi.patch<IUpdatePaymentResponse>(
      `/payments/${paymentId}`,
      data as unknown as Record<string, unknown>
    );
    return response;
  }
}

export const paymentService = new PaymentService();