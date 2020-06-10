import React, { useRef, useCallback } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import { useToast } from '../../hooks/ToastContext';
import { useAuth } from '../../hooks/AuthContext';

import logoImg from '../../assets/logo.svg';
import getValidationErrors from '../../utils/getValidationErrors';
import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, AnimationContainer, Content, Background } from './styles';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = useCallback(async (data: SignInFormData) => {
   try{
    formRef.current?.setErrors({});

    const schema = Yup.object().shape({
      email: Yup.string()
        .required('E-mail obrigatório')
        .email('Digite um email válido'),
      password: Yup.string()
        .required('Senha obrigatória'),
    });

    await schema.validate(data,{
      abortEarly: false,
    });

    await signIn({
      email: data.email,
      password: data.password,
    });
    }catch (err) {
      if(err instanceof Yup.ValidationError){
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        return;
      }
      //Disparar um toast
      addToast({
        type: 'error',
        title: 'Erro na autenticação',
        description: 'Ocorreu um erro ao logar, cheque as credenciais.',
      });

    }
  },[signIn, addToast]);

  return(
    <Container>
      <Content>
        <AnimationContainer>>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu logon</h1>

            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Input name="password" icon={FiLock} type="password" placeholder="Senha" />

            <Button type="submit">Entrar</Button>

            <a href="forgot">Esqueci minha senha</a>
          </Form>

          <Link to="/signup">
            <FiLogIn />
            Criar Conta
          </Link>
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  );
}
export default SignIn;
