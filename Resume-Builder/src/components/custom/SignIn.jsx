/* eslint-disable react/no-unescaped-entities */
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"

import { Button } from '@/components/ui/button'
import { Label } from '../ui/label';

import { Input } from '../ui/input';

import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/stores/authStore'; // Import the auth store
import { Loader2, Linkedin } from 'lucide-react'; // Import icons from lucide-react

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            await login(data.email, data.password);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-primary to-blue-300">
            <Card className="w-full max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
                <CardHeader className="text-center">
                    <h2 className="text-2xl font-bold">Chào mừng!</h2>
                    <p className="text-gray-500">Đăng nhập tài khoản <span className='text-primary font-semibold'>STUGART</span> của bạn</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                {...register('email', { required: 'Email phải nhập' })}
                                className="mt-1"
                                placeholder="Nhập email của bạn"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Mật khẩu
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                {...register('password', { required: 'Mật khẩu phải nhập ' })}
                                className="mt-1"
                                placeholder="Nhập mật khẩu của bạn"
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>


                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <Loader2 className="mr-2 animate-spin" />
                                    Đang đăng nhập
                                </span>
                            ) : (
                                "Đăng nhập"
                            )}
                        </Button>
                    </form>

                    <div className="flex items-center justify-between mt-4">
                        <hr className="w-full border-gray-300" />
                        <span className="px-3 text-gray-500">OR</span>
                        <hr className="w-full border-gray-300" />
                    </div>

                    <div className="flex gap-4 justify-center mt-4">


                        <button className="flex items-center justify-center p-2 border rounded-full text-gray-500 hover:bg-gray-100">
                            <Linkedin size={20} />
                        </button>
                    </div>
                </CardContent>
                
            </Card>
        </div>
    );
};

export default LoginPage;
