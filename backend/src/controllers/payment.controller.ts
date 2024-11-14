// controllers/paymentController.ts
import { Request, Response } from "express";
import { convertMoneyToDiamonds } from "../services/diamondService";
import { PaymentStatus, Transaction } from "../models/transaction.model";
import crypto from "crypto";
import axios from "axios";
export async function manualPayment(req: Request, res: Response) {
  const { userId, amount, urlImage } = req.body;

  try {
    // Lưu giao dịch với trạng thái PENDING

    const transaction = new Transaction({
      user: userId,
      amount,
      diamonds: 0, // Sẽ cập nhật khi admin xác nhận
      status: "pending",
      paymentMethod: "manual",
      urlImage,
    });
    await transaction.save();

    res.json({ error: null, data: transaction });
  } catch (error: any) {
    res.status(500).json({ error: error.message, data: null });
  }
}

export async function approveManualTransaction(req: Request, res: Response) {
  const { transactionId, status } = req.body;
  try {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction || !status) {
      return res
        .status(404)
        .json({ error: "transaction not found", data: null });
    }
    if (status == 1) {
      transaction.status = PaymentStatus.COMPLETED;
      const result = await convertMoneyToDiamonds(
        transaction.user.toString(),
        transaction.amount
      );
      transaction.diamonds = result.diamonds;
    } else {
      transaction.status = PaymentStatus.FAILED;
    }

    await transaction.save();
    res.json({ error: null, data: transaction });
  } catch (error: any) {
    return res.status(400).json({ error: error.message, data: null });
  }
}

export async function getTransactionsByUserId(req: Request, res: Response) {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  try {
    // @ts-ignore
    const transactions = await Transaction.paginate(
      { user: userId },
      { page: Number(page), limit: Number(limit), sort: { createdAt: -1 } }
    );

    res.json({ error: null, data: transactions });
  } catch (error: any) {
    res.status(500).json({ error: error.message, data: null });
  }
}

// controllers/paymentController.ts
export async function getTransactionById(req: Request, res: Response) {
  const { transactionId } = req.params;

  try {
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res
        .status(404)
        .json({ error: "Transaction not found", data: null });
    }

    res.json({ error: null, data: transaction });
  } catch (error: any) {
    res.status(500).json({ error: error.message, data: null });
  }
}

export async function createMomoPayment(req: Request, res: Response) {
  const { userId, amount } = req.body;

  try {
    // Lưu giao dịch với trạng thái PENDING
    const transaction = new Transaction({
      user: userId,
      amount,
      diamonds: 0, // Sẽ cập nhật khi thanh toán thành công
      status: PaymentStatus.PENDING,
      paymentMethod: "momo",
    });
    await transaction.save();

    const accessKey = "F8BBA842ECF85";
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const orderInfo = "pay with MoMo";
    const partnerCode = "MOMO";
    const redirectUrl =
      "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
    const ipnUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
    const requestType = "payWithMethod";
    const orderId = transaction?._id;
    const requestId = orderId;
    const extraData = "";
    var orderGroupId = "";
    var autoCapture = true;
    var lang = "vi";

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature =
      "accessKey=" +
      accessKey +
      "&amount=" +
      amount +
      "&extraData=" +
      extraData +
      "&ipnUrl=" +
      ipnUrl +
      "&orderId=" +
      orderId +
      "&orderInfo=" +
      orderInfo +
      "&partnerCode=" +
      partnerCode +
      "&redirectUrl=" +
      redirectUrl +
      "&requestId=" +
      requestId +
      "&requestType=" +
      requestType;

    var signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature,
    });

    const options = {
      url: "https://test-payment.momo.vn/v2/gateway/api/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };

    const response = await axios.request(options);
    // Chuyển hướng người dùng đến trang thanh toán VNPay
    res.json({ error: null, data: response.data });
  } catch (error: any) {
    res.status(500).json({ error: error.message, data: null });
  }
}
