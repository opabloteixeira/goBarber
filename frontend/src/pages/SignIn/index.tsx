import React, { useCallback, useRef } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import * as Yup from 'yup';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { Link, useHistory } from 'react-router-dom';

import { Container, Content, Background, AnimationContainer } from './styles';
import Button from '../../components/Button';
import Input from '../../components/Input';
import getValidationsErrors from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

import LogoImg from '../../assets/logo.svg';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(async (data: SignInFormData) => {// eslint-disable-line
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().required('Senha obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({
          email: data.email,
          password: data.password,
        });

        history.push('/dashboard');
      } catch (error) {
        console.log(error); // eslint-disable-line
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationsErrors(error);
          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description: 'Ocorreu um erro ao fazer login, cheque as credenciais',
        });
      }
    },
    [signIn, addToast, history],
  );

  return (
    <>
      <Container>
        <Content>
          <AnimationContainer>
            <img src={LogoImg} alt="AppBarber" />

            <Form ref={formRef} onSubmit={handleSubmit}>
              <h1>Fazer seu login</h1>
              <Input name="email" icon={FiMail} placeholder="E-mail" />
              <Input
                name="password"
                icon={FiLock}
                type="password"
                placeholder="Senha"
              />
              <Button type="submit">Acessar</Button>
              <a href="forgot">Esqueci minha senha</a>
            </Form>

            <Link to="signup">
              <FiLogIn />
              Criar conta
            </Link>
          </AnimationContainer>
        </Content>
        <Background />
      </Container>
    </>
  );
};

export default SignIn;
