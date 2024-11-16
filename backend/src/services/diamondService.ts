// services/diamondService.ts
import User from "../models/User";
import { DiamondConversion } from "../models/diamondConversion.model";
import Rank from "../models/rank.model";

export async function convertMoneyToDiamonds(userId: string, amount: number) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Quy đổi tiền thành kim cương
  let conversion: any = await DiamondConversion.findOne({ currency: "VND" });
  if (!conversion) {
    conversion = {
      rate: 10000,
    };
  }

  const diamonds = Math.floor(amount / conversion.rate);

  // Lấy hạng của người dùng để xác định tỷ lệ thưởng
  const rank = await Rank.findOne({ name: user.rank });

  const bonusMultiplier = rank ? rank.bonusMultiplier : 0;

  // Tính số kim cương cộng thêm dựa trên tỷ lệ thưởng
  const bonusDiamonds = diamonds * bonusMultiplier;
  const totalDiamonds = diamonds + bonusDiamonds;
  if (!user.diamonds) user.diamonds = 0;
  user.diamonds += totalDiamonds;
  if (!user.totalSpent) user.totalSpent = 0;
  user.totalSpent += amount;

  // Cập nhật hạng dựa trên số kim cương
  const ranks = await Rank.find().sort({ minDiamonds: 1, minTotalSpent: 1 });
  for (const rank of ranks) {
    if (
      !!user?.diamonds &&
      user?.diamonds >= rank.minDiamonds &&
      !!user?.totalSpent &&
      user?.totalSpent >= rank.minTotalSpent
    ) {
      user.rank = rank.name;
    } else {
      break;
    }
  }

  await user.save();
  return { diamonds, newRank: user.rank };
}

export async function autoRankUpgrade(userId: string) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Lấy danh sách hạng và sắp xếp theo thứ tự từ thấp đến cao
  const ranks = await Rank.find().sort({ minDiamonds: 1, minTotalSpent: 1 });

  // Xác định hạng cao nhất mà người dùng có thể đạt dựa trên số kim cương và tổng chi tiêu
  let newRank = user.rank;
  for (const rank of ranks) {
    if (
      !!user?.diamonds &&
      user?.diamonds >= rank.minDiamonds &&
      !!user?.totalSpent &&
      user?.totalSpent >= rank.minTotalSpent
    ) {
      newRank = rank.name;
    } else {
      break;
    }
  }

  if (newRank !== user.rank) {
    user.rank = newRank;
    await user.save();
    return { success: true, newRank };
  }
  return { success: false, message: "No rank upgrade available" };
}
