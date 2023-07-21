import { Button, Form, Space, Typography } from 'antd';
import Input from '../components/input.component';
import React, { useState } from 'react';
import { SignIn } from '../types/sign-in.type';
import { signIn } from '../api/auth.service';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

const defaultValues = {
  username: '',
  password: '',
};

const AuthPage = () => {
  const [formFields, setFormFields] = useState<SignIn>(defaultValues);
  const navigate = useNavigate();
  const { username, password } = formFields;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const signInDto: SignIn = {
      username,
      password,
    };
    try {
      const respone = await signIn(signInDto);
      sessionStorage.setItem('token', respone.token);
      sessionStorage.setItem('username', username);
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="w-[400px] h-[50%] bg-white rounded-md relative 
    top-[30%] left-[50%] translate-x-[-50%] translate-y-[-30%] p-10 shadow-2xl 
    flex justify-center items-center text-center"
    >
      <Space direction="vertical" className="w-[400px] h-full">
        <Text className="font-cursive text-4xl mb-8 block">Đăng nhập</Text>
        <Form onSubmitCapture={handleSubmit}>
          <Form.Item>
            <Input
              placeHolder="Username"
              inputName="username"
              inputValue={username}
              handleChange={handleChange}
              type="text"
            />
          </Form.Item>
          <Form.Item>
            <Input
              placeHolder="Password"
              inputName="password"
              inputValue={password}
              handleChange={handleChange}
              type="password"
            />
          </Form.Item>
          <Button
            size="large"
            htmlType="submit"
            type="primary"
            className="bg-blue-500 w-full"
          >
            Đăng nhập
          </Button>
        </Form>
      </Space>
    </div>
  );
};

export default AuthPage;
