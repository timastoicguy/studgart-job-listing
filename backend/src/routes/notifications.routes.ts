import { Router } from "express";
import { Request, Response } from "express";
import Notification from "../models/notification.model";
const router = Router();
import { io } from "../config/socket";

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Tạo và gửi thông báo cho người dùng
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID của người dùng nhận thông báo
 *               type:
 *                 type: string
 *                 description: Loại thông báo
 *               content:
 *                 type: string
 *                 description: Nội dung của thông báo
 *     responses:
 *       201:
 *         description: Thông báo đã được tạo và gửi thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 notification:
 *                   $ref: '#/components/schemas/Notification'
 */
router.post("/notifications", async (req, res) => {
  const { userId, type, content } = req.body;
  const notification = new Notification({
    userId,
    type,
    content,
    isRead: false,
  });
  await notification.save();
  io.to(userId).emit("notification", notification);
  res.status(201).json({ success: true, notification });
});

/**
 * @swagger
 * /notifications/{userId}:
 *   get:
 *     summary: Lấy tất cả thông báo của người dùng với phân trang
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của người dùng
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng thông báo trên mỗi trang
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 notifications:
 *                   type: object
 *                   properties:
 *                     docs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Notification'
 */
router.get("/notifications/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  try {
    const options = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      sort: { createdAt: -1 },
    };
    //@ts-ignore
    const notifications = await Notification.paginate({ userId }, options);
    res.status(200).json({ success: true, notifications });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch notifications" });
  }
});

/**
 * @swagger
 * /notification/{id}:
 *   get:
 *     summary: Lấy thông báo theo ID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của thông báo
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 notification:
 *                   $ref: '#/components/schemas/Notification'
 */
router.get("/notification/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const notification = await Notification.findById(id);
    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }
    res.status(200).json({ success: true, notification });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch notification" });
  }
});

/**
 * @swagger
 * /notification/{id}:
 *   delete:
 *     summary: Xóa thông báo theo ID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của thông báo
 *     responses:
 *       200:
 *         description: Thông báo đã được xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.delete("/notification/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Notification deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete notification" });
  }
});

/**
 * @swagger
 * /notification/{id}:
 *   patch:
 *     summary: Cập nhật thông báo theo ID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của thông báo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Nội dung của thông báo
 *               isRead:
 *                 type: boolean
 *                 description: Trạng thái đã đọc của thông báo
 *     responses:
 *       200:
 *         description: Thông báo đã được cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 notification:
 *                   $ref: '#/components/schemas/Notification'
 */
router.patch("/notification/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content, isRead } = req.body;
  try {
    const notification = await Notification.findById(id);
    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }
    if (content) notification.content = content;
    if (typeof isRead === "boolean") notification.isRead = isRead;
    await notification.save();
    res.status(200).json({ success: true, notification });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update notification" });
  }
});

export default router;
