// controllers/paymentController.ts
import { Request, Response } from "express";
import { convertMoneyToDiamonds } from "../services/diamondService";
import { PaymentStatus, Transaction } from "../models/transaction.model";
import crypto from "crypto";
import axios from "axios";
import { config } from "../config/dotenv.config";
import User from "../models/User";
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
export async function getTransactions(req: Request, res: Response) {
  const { page = 1, limit = 10 } = req.query;

  try {
    // @ts-ignore
    const transactions = await Transaction.paginate(
      {},
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
  const { userId, amount, info } = req.body;
  console.log(req.body);
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

    const accessKey = config.accessMomoKey;
    const secretKey = config.secretMomoKey ?? "";
    const orderInfo = info ?? "pay with MoMo";
    const partnerCode = config.parnerMomoCode;
    const redirectUrl = config.redirectUrl;
    const ipnUrl = `${config.ipnURl}/momo_return`;
    const requestType = "payWithMethod";
    const orderId = transaction?._id;
    const requestId = orderId;
    const extraData = "";
    var orderGroupId = "";
    var autoCapture = true;
    var lang = "vi";

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    const rawSignature =
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

    console.log(signature);
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

export async function handleMomoPayReturn(req: Request, res: Response) {
  const { orderId, partnerCode, amount, resultCode, transId, signature } =
    req.body;

  const transaction = await Transaction.findById(orderId);
  if (transaction && transaction?.amount == amount) {
    if (resultCode == 0) {
      // Thanh toán thành công
      console.log("thành công");
      transaction.status = PaymentStatus.COMPLETED;
      const result = await convertMoneyToDiamonds(
        transaction.user.toString(),
        transaction.amount
      );
      console.log("kim cương", result);
      transaction.diamonds = result.diamonds;
    } else {
      transaction.status = PaymentStatus.FAILED;
    }
    await transaction.save();

    res.json({ error: null, data: transaction });
  } else {
    res.status(400).json({ error: "Invalid secure hash", data: null });
  }
}

export async function handelCheckStatus(req: Request, res: Response) {
  const { orderId } = req.body;
  try {
    const rawSignature = `accessKey=${config.accessMomoKey}&orderId=${orderId}&partnerCode=${config.parnerMomoCode}&requestId=${orderId}`;
    const signature = crypto
      .createHmac("sha256", config.secretMomoKey as string)
      .update(rawSignature)
      .digest("hex");

    const requestBody = JSON.stringify({
      partnerCode: config.parnerMomoCode,
      requestId: orderId,
      orderId: orderId,
      signature: signature,
      lang: "vi",
    });

    // options for axios
    const options = {
      method: "POST",
      url: "https://test-payment.momo.vn/v2/gateway/api/query",
      headers: {
        "Content-Type": "application/json",
      },
      data: requestBody,
    };

    const result = await axios.request(options);

    return res.status(200).json({ error: null, data: result.data });
  } catch (error: any) {
    res.status(500).json({ error: error.message, data: null });
  }
}

export const diamondPayment = async (req: Request, res: Response) => {
  const { userId, requiredDiamonds, description } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found", data: null });
    }
    // Giảm số kim cương
    const freeDM = user?.freeDiamonds ?? 0;
    if (!user.diamonds) user.diamonds = 0;
    if (freeDM > 0) {
      if (requiredDiamonds > freeDM) {
        user.freeDiamonds = 0;
        user.diamonds -= requiredDiamonds - freeDM;
      } else {
        user.freeDiamonds = user.freeDiamonds - requiredDiamonds;
      }
    } else {
      user.diamonds -= requiredDiamonds;
    }
    await user.save();
    // Ghi lại giao dịch
    const transaction = new Transaction({
      user: userId,
      diamonds: requiredDiamonds,
      amount: 0,
      status: PaymentStatus.COMPLETED,
      paymentMethod: "diamond",
      description,
    });
    await transaction.save();

    res.json({ error: null, data: { user, transaction } });
  } catch (error: any) {
    res.status(500).json({ error: error.message, data: null });
  }
};

export const handelCheckDiamonds = async (req: Request, res: Response) => {
  const { userId } = req.params; // Lấy userId từ params
  console.log(userId);
  try {
    // Tìm người dùng
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found", data: null });
    }
    // Trả về số kim cương hiện tại
    res.json({
      error: null,
      data: {
        diamonds: user.diamonds,
        freeDiamonds: user.freeDiamonds,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message, data: null });
  }
};
