// 代码生成时间: 2025-09-08 09:39:02
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

// 定义 Prisma 实例以供全局使用
const prisma = new PrismaClient();

// 用户登录验证系统
class UserLoginSystem {
    /**
     * 用户登录验证
     * @param req Express 请求对象
     * @param res Express 响应对象
     */
    public async login(req: Request, res: Response): Promise<void> {
        try {
            // 从请求中提取用户名和密码
            const { username, password } = req.body;

            // 检查用户名和密码是否存在
            if (!username || !password) {
                return res.status(400).json({ message: 'Username and password are required.' });
            }

            // 通过 Prisma 客户端查询用户是否存在
            const user = await prisma.user.findUnique({
                where: {
                    username
                }
            });

            // 如果用户不存在，返回 404 错误
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            // 检查密码是否匹配
            const isPasswordMatch = await bcrypt.compare(password, user.password);

            // 如果密码不匹配，返回 401 错误
            if (!isPasswordMatch) {
                return res.status(401).json({ message: 'Password is incorrect.' });
            }

            // 如果认证成功，返回 200 状态码和成功消息
            return res.status(200).json({ message: 'Login successful.' });
        } catch (error) {
            // 错误处理
            console.error(error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    }
}

// 导出 UserLoginSystem 类
export { UserLoginSystem };

// 使用示例
// const userLoginSystem = new UserLoginSystem();
// userLoginSystem.login(req, res);