'use client';

import axios from 'axios';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import useRegisterModal from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../Inputs/Input';
import Button from '../Button';

const LoginModal = () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    signIn('credentials', {
      ...data,
      redirect: false,
    }).then((callback) => {
      setIsLoading(false);

      if (callback?.ok) {
        toast.success('Login successful!');
        router.refresh();
        loginModal.onClose();
      }

      if (callback?.error) {
        toast.error(callback.error);
      }
    });
  };

  const bodyContent = (
    <div className='flex flex-col gap-4'>
      <Heading
        title='Welcome back!'
        subtitle='Login to your account'
        center={false}
      />

      <Input
        id='email'
        label='Email'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />

      <Input
        id='password'
        label='Password'
        type='password'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = (
    <div className='flex flex-col gap-4'>
      <hr />

      <Button
        outline
        label='Continue with Google'
        icon={FcGoogle}
        onClick={() => signIn('google')}
      />

      <Button
        outline
        label='Continue with Github'
        icon={AiFillGithub}
        onClick={() => signIn('github')}
      />

      <div className='text-neutral-500 text-center mt-4 font-light'>
        <div className='flex flex-row items-center justify-center gap-2'>
          <div>Already have an account?</div>
          <div
            onClick={registerModal.onClose}
            className='text-neutral-800 cursor-pointer hover:underline'
          >
            Login
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={loginModal.isOpen}
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      title='Login'
      actionLabel='Continue'
      disabled={isLoading}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default LoginModal;
